from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Ejercicio
from ..schemas import EjercicioCreate, EjercicioResponse

router = APIRouter(prefix="/api/ejercicios", tags=["Ejercicios"])

@router.get("", response_model=List[EjercicioResponse])
def listar_ejercicios(
    grupo_muscular: Optional[str] = Query(None, description="Filtrar por grupo muscular"),
    busqueda: Optional[str] = Query(None, description="Buscar por nombre"),
    db: Session = Depends(get_db)
):
    query = db.query(Ejercicio)
    if grupo_muscular and grupo_muscular != "Todos":
        query = query.filter(Ejercicio.grupo_muscular == grupo_muscular)
    if busqueda:
        query = query.filter(Ejercicio.nombre.ilike(f"%{busqueda}%"))
    return query.order_by(Ejercicio.grupo_muscular, Ejercicio.nombre).all()

@router.get("/grupos-musculares", response_model=List[str])
def listar_grupos_musculares(db: Session = Depends(get_db)):
    grupos = db.query(Ejercicio.grupo_muscular).distinct().all()
    return [g[0] for g in grupos if g[0]]

@router.get("/{ejercicio_id}", response_model=EjercicioResponse)
def obtener_ejercicio(ejercicio_id: int, db: Session = Depends(get_db)):
    ej = db.query(Ejercicio).filter(Ejercicio.id == ejercicio_id).first()
    if not ej:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    return ej

@router.post("", response_model=EjercicioResponse)
def crear_ejercicio(ej_in: EjercicioCreate, db: Session = Depends(get_db)):
    nuevo_ej = Ejercicio(
        nombre=ej_in.nombre,
        grupo_muscular=ej_in.grupo_muscular,
        equipo=ej_in.equipo,
        descripcion=ej_in.descripcion,
        es_personalizado=True
    )
    db.add(nuevo_ej)
    db.commit()
    db.refresh(nuevo_ej)
    return nuevo_ej

@router.delete("/{ejercicio_id}")
def eliminar_ejercicio(ejercicio_id: int, db: Session = Depends(get_db)):
    ej = db.query(Ejercicio).filter(Ejercicio.id == ejercicio_id).first()
    if not ej:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    db.delete(ej)
    db.commit()
    return {"message": "Ejercicio eliminado correctamente"}
