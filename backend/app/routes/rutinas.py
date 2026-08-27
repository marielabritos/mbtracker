from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import Rutina, DiaRutina, DiaEjercicio
from ..schemas import (
    RutinaCreate, RutinaResponse,
    DiaRutinaCreate, DiaRutinaResponse,
    DiaEjercicioCreate, DiaEjercicioResponse
)

router = APIRouter(prefix="/api/rutinas", tags=["Rutinas"])

@router.get("", response_model=List[RutinaResponse])
def listar_rutinas(db: Session = Depends(get_db)):
    rutinas = db.query(Rutina).options(
        joinedload(Rutina.dias).joinedload(DiaRutina.ejercicios).joinedload(DiaEjercicio.ejercicio)
    ).all()
    return rutinas

@router.get("/{rutina_id}", response_model=RutinaResponse)
def obtener_rutina(rutina_id: int, db: Session = Depends(get_db)):
    rutina = db.query(Rutina).options(
        joinedload(Rutina.dias).joinedload(DiaRutina.ejercicios).joinedload(DiaEjercicio.ejercicio)
    ).filter(Rutina.id == rutina_id).first()
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    return rutina

@router.post("", response_model=RutinaResponse)
def crear_rutina(rutina_in: RutinaCreate, db: Session = Depends(get_db)):
    nueva_rutina = Rutina(
        nombre=rutina_in.nombre,
        descripcion=rutina_in.descripcion,
        duracion_semanas=rutina_in.duracion_semanas or "4 semanas",
        duracion_estimada_minutos=rutina_in.duracion_estimada_minutos or 50,
        activa=rutina_in.activa
    )
    db.add(nueva_rutina)
    db.flush()

    for dia_in in rutina_in.dias:
        nuevo_dia = DiaRutina(
            rutina_id=nueva_rutina.id,
            nombre=dia_in.nombre,
            orden=dia_in.orden
        )
        db.add(nuevo_dia)
        db.flush()

        for ej_in in dia_in.ejercicios:
            nuevo_dia_ej = DiaEjercicio(
                dia_id=nuevo_dia.id,
                ejercicio_id=ej_in.ejercicio_id,
                series_objetivo=ej_in.series_objetivo,
                reps_objetivo=ej_in.reps_objetivo,
                descanso_segundos=ej_in.descanso_segundos,
                orden=ej_in.orden,
                notas=ej_in.notas
            )
            db.add(nuevo_dia_ej)

    db.commit()
    return obtener_rutina(nueva_rutina.id, db)

@router.put("/{rutina_id}", response_model=RutinaResponse)
def actualizar_rutina(rutina_id: int, rutina_in: RutinaCreate, db: Session = Depends(get_db)):
    rutina = db.query(Rutina).filter(Rutina.id == rutina_id).first()
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")

    rutina.nombre = rutina_in.nombre
    rutina.descripcion = rutina_in.descripcion
    rutina.duracion_semanas = rutina_in.duracion_semanas or "4 semanas"
    rutina.duracion_estimada_minutos = rutina_in.duracion_estimada_minutos or 50
    rutina.activa = rutina_in.activa

    # Borrar días anteriores y reemplazarlos
    db.query(DiaRutina).filter(DiaRutina.rutina_id == rutina_id).delete()
    db.flush()

    for dia_in in rutina_in.dias:
        nuevo_dia = DiaRutina(
            rutina_id=rutina.id,
            nombre=dia_in.nombre,
            orden=dia_in.orden
        )
        db.add(nuevo_dia)
        db.flush()

        for ej_in in dia_in.ejercicios:
            nuevo_dia_ej = DiaEjercicio(
                dia_id=nuevo_dia.id,
                ejercicio_id=ej_in.ejercicio_id,
                series_objetivo=ej_in.series_objetivo,
                reps_objetivo=ej_in.reps_objetivo,
                descanso_segundos=ej_in.descanso_segundos,
                orden=ej_in.orden,
                notas=ej_in.notas
            )
            db.add(nuevo_dia_ej)

    db.commit()
    return obtener_rutina(rutina.id, db)

@router.delete("/{rutina_id}")
def eliminar_rutina(rutina_id: int, db: Session = Depends(get_db)):
    rutina = db.query(Rutina).filter(Rutina.id == rutina_id).first()
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    db.delete(rutina)
    db.commit()
    return {"message": "Rutina eliminada correctamente"}
