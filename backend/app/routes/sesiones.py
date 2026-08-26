from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from ..database import get_db
from ..models import SesionEntrenamiento, SerieLog, Ejercicio
from ..schemas import SesionCreate, SesionResponse, SerieLogResponse

router = APIRouter(prefix="/api/sesiones", tags=["Sesiones de Entrenamiento"])

@router.get("", response_model=List[SesionResponse])
def listar_sesiones(limit: int = 50, db: Session = Depends(get_db)):
    sesiones = (
        db.query(SesionEntrenamiento)
        .options(joinedload(SesionEntrenamiento.series).joinedload(SerieLog.ejercicio))
        .order_by(SesionEntrenamiento.fecha_inicio.desc())
        .limit(limit)
        .all()
    )
    return sesiones

@router.get("/ultimo-registro/{ejercicio_id}", response_model=List[SerieLogResponse])
def obtener_ultimo_registro_ejercicio(ejercicio_id: int, db: Session = Depends(get_db)):
    # Buscar la última sesión que contenga este ejercicio
    ultima_serie = (
        db.query(SerieLog)
        .filter(SerieLog.ejercicio_id == ejercicio_id, SerieLog.completada == True)
        .order_by(SerieLog.id.desc())
        .first()
    )
    if not ultima_serie:
        return []

    # Obtener todas las series de ese ejercicio en esa misma sesión
    series = (
        db.query(SerieLog)
        .filter(
            SerieLog.sesion_id == ultima_serie.sesion_id,
            SerieLog.ejercicio_id == ejercicio_id
        )
        .order_by(SerieLog.numero_serie.asc())
        .all()
    )
    return series

@router.get("/{sesion_id}", response_model=SesionResponse)
def obtener_sesion(sesion_id: int, db: Session = Depends(get_db)):
    sesion = (
        db.query(SesionEntrenamiento)
        .options(joinedload(SesionEntrenamiento.series).joinedload(SerieLog.ejercicio))
        .filter(SesionEntrenamiento.id == sesion_id)
        .first()
    )
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    return sesion

@router.post("", response_model=SesionResponse)
def registrar_sesion(sesion_in: SesionCreate, db: Session = Depends(get_db)):
    ahora = datetime.utcnow()
    nueva_sesion = SesionEntrenamiento(
        nombre=sesion_in.nombre,
        dia_rutina_id=sesion_in.dia_rutina_id,
        fecha_inicio=sesion_in.fecha_inicio or ahora,
        fecha_fin=sesion_in.fecha_fin or ahora,
        duracion_segundos=sesion_in.duracion_segundos or 0,
        notas=sesion_in.notas,
        completado=True
    )
    db.add(nueva_sesion)
    db.flush()

    for s_in in sesion_in.series:
        # Calcular si esta serie es un nuevo PR de peso para este ejercicio
        peso = s_in.peso_kg or 0.0
        es_pr = False

        if peso > 0:
            max_historico = (
                db.query(func.max(SerieLog.peso_kg))
                .filter(SerieLog.ejercicio_id == s_in.ejercicio_id, SerieLog.completada == True)
                .scalar()
            )
            if max_historico is None or peso > max_historico:
                es_pr = True

        nueva_serie = SerieLog(
            sesion_id=nueva_sesion.id,
            ejercicio_id=s_in.ejercicio_id,
            numero_serie=s_in.numero_serie,
            peso_kg=peso,
            repeticiones=s_in.repeticiones,
            rpe=s_in.rpe,
            completada=s_in.completada,
            es_pr=es_pr,
            notas=s_in.notas
        )
        db.add(nueva_serie)

    db.commit()
    return obtener_sesion(nueva_sesion.id, db)

@router.delete("/{sesion_id}")
def eliminar_sesion(sesion_id: int, db: Session = Depends(get_db)):
    sesion = db.query(SesionEntrenamiento).filter(SesionEntrenamiento.id == sesion_id).first()
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    db.delete(sesion)
    db.commit()
    return {"message": "Sesión eliminada correctamente"}
