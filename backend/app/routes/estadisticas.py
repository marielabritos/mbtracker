from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from ..database import get_db
from ..models import SesionEntrenamiento, SerieLog, Ejercicio
from ..schemas import EstadisticasDashboard, PersonalRecord, SesionResponse

router = APIRouter(prefix="/api/estadisticas", tags=["Estadísticas & Progreso"])

@router.get("/dashboard", response_model=EstadisticasDashboard)
def obtener_estadisticas_dashboard(db: Session = Depends(get_db)):
    total_entrenamientos = db.query(SesionEntrenamiento).count()

    # Duración total en minutos
    total_segundos = db.query(func.sum(SesionEntrenamiento.duracion_segundos)).scalar() or 0
    tiempo_total_minutos = int(total_segundos / 60)

    # Volumen semanal (últimos 7 días): Suma de (peso_kg * repeticiones)
    hace_7_dias = datetime.utcnow() - timedelta(days=7)
    series_semana = (
        db.query(SerieLog)
        .join(SesionEntrenamiento)
        .filter(SesionEntrenamiento.fecha_inicio >= hace_7_dias, SerieLog.completada == True)
        .all()
    )
    volumen_semanal_kg = sum(s.peso_kg * s.repeticiones for s in series_semana)

    # Racha / Entrenamientos en el último mes (30 días)
    hace_30_dias = datetime.utcnow() - timedelta(days=30)
    racha_mes = (
        db.query(SesionEntrenamiento)
        .filter(SesionEntrenamiento.fecha_inicio >= hace_30_dias)
        .count()
    )

    # Top PRs por ejercicio
    prs_raw = (
        db.query(
            Ejercicio.id.label("ejercicio_id"),
            Ejercicio.nombre.label("ejercicio_nombre"),
            Ejercicio.grupo_muscular.label("grupo_muscular"),
            func.max(SerieLog.peso_kg).label("peso_maximo_kg")
        )
        .join(SerieLog, Ejercicio.id == SerieLog.ejercicio_id)
        .filter(SerieLog.completada == True, SerieLog.peso_kg > 0)
        .group_by(Ejercicio.id, Ejercicio.nombre, Ejercicio.grupo_muscular)
        .order_by(func.max(SerieLog.peso_kg).desc())
        .limit(8)
        .all()
    )

    ultimos_prs = []
    for pr in prs_raw:
        # Buscar la serie específica para obtener reps, fecha y sesión
        serie_pr = (
            db.query(SerieLog)
            .join(SesionEntrenamiento)
            .filter(
                SerieLog.ejercicio_id == pr.ejercicio_id,
                SerieLog.peso_kg == pr.peso_maximo_kg,
                SerieLog.completada == True
            )
            .order_by(SesionEntrenamiento.fecha_inicio.desc())
            .first()
        )
        if serie_pr and serie_pr.sesion:
            ultimos_prs.append(PersonalRecord(
                ejercicio_id=pr.ejercicio_id,
                ejercicio_nombre=pr.ejercicio_nombre,
                grupo_muscular=pr.grupo_muscular,
                peso_maximo_kg=pr.peso_maximo_kg,
                repeticiones=serie_pr.repeticiones,
                fecha=serie_pr.sesion.fecha_inicio,
                sesion_id=serie_pr.sesion_id
            ))

    # Últimas 5 sesiones
    ultimas_sesiones = (
        db.query(SesionEntrenamiento)
        .options(joinedload(SesionEntrenamiento.series).joinedload(SerieLog.ejercicio))
        .order_by(SesionEntrenamiento.fecha_inicio.desc())
        .limit(5)
        .all()
    )

    return EstadisticasDashboard(
        total_entrenamientos=total_entrenamientos,
        racha_dias_mes=racha_mes,
        volumen_semanal_kg=round(volumen_semanal_kg, 1),
        tiempo_total_minutos=tiempo_total_minutos,
        ultimos_prs=ultimos_prs,
        ultimas_sesiones=ultimas_sesiones
    )

@router.get("/ejercicio/{ejercicio_id}/progreso")
def obtener_progreso_ejercicio(ejercicio_id: int, db: Session = Depends(get_db)):
    # Obtener historial de sesiones donde se realizó este ejercicio
    series = (
        db.query(SerieLog)
        .join(SesionEntrenamiento)
        .filter(SerieLog.ejercicio_id == ejercicio_id, SerieLog.completada == True)
        .order_by(SesionEntrenamiento.fecha_inicio.asc())
        .all()
    )

    # Agrupar por sesión para obtener el peso máximo y volumen en cada fecha
    puntos_grafico: Dict[int, Dict[str, Any]] = {}
    for s in series:
        s_id = s.sesion_id
        fecha_str = s.sesion.fecha_inicio.strftime("%d/%m/%Y")
        if s_id not in puntos_grafico:
            puntos_grafico[s_id] = {
                "fecha": fecha_str,
                "fecha_iso": s.sesion.fecha_inicio.isoformat(),
                "peso_max": s.peso_kg,
                "reps_en_peso_max": s.repeticiones,
                "volumen_total": s.peso_kg * s.repeticiones,
                "1rm_estimado": round(s.peso_kg * (1 + s.repeticiones / 30), 1) if s.repeticiones > 0 else s.peso_kg
            }
        else:
            puntos_grafico[s_id]["volumen_total"] += s.peso_kg * s.repeticiones
            if s.peso_kg > puntos_grafico[s_id]["peso_max"]:
                puntos_grafico[s_id]["peso_max"] = s.peso_kg
                puntos_grafico[s_id]["reps_en_peso_max"] = s.repeticiones
                puntos_grafico[s_id]["1rm_estimado"] = round(s.peso_kg * (1 + s.repeticiones / 30), 1) if s.repeticiones > 0 else s.peso_kg

    return list(puntos_grafico.values())
