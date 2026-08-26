from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# --- EJERCICIO SCHEMAS ---
class EjercicioBase(BaseModel):
    nombre: str
    grupo_muscular: str
    equipo: Optional[str] = None
    descripcion: Optional[str] = None

class EjercicioCreate(EjercicioBase):
    es_personalizado: Optional[bool] = True

class EjercicioResponse(EjercicioBase):
    id: int
    es_personalizado: bool
    fecha_creacion: datetime

    class Config:
        from_attributes = True


# --- DIA EJERCICIO SCHEMAS ---
class DiaEjercicioBase(BaseModel):
    ejercicio_id: int
    series_objetivo: int = 3
    reps_objetivo: str = "8-12"
    descanso_segundos: int = 90
    orden: int = 1
    notas: Optional[str] = None

class DiaEjercicioCreate(DiaEjercicioBase):
    pass

class DiaEjercicioResponse(DiaEjercicioBase):
    id: int
    dia_id: int
    ejercicio: EjercicioResponse

    class Config:
        from_attributes = True


# --- DIA RUTINA SCHEMAS ---
class DiaRutinaBase(BaseModel):
    nombre: str
    orden: int = 1

class DiaRutinaCreate(DiaRutinaBase):
    ejercicios: List[DiaEjercicioCreate] = []

class DiaRutinaResponse(DiaRutinaBase):
    id: int
    rutina_id: int
    ejercicios: List[DiaEjercicioResponse] = []

    class Config:
        from_attributes = True


# --- RUTINA SCHEMAS ---
class RutinaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    activa: bool = True

class RutinaCreate(RutinaBase):
    dias: List[DiaRutinaCreate] = []

class RutinaResponse(RutinaBase):
    id: int
    fecha_creacion: datetime
    dias: List[DiaRutinaResponse] = []

    class Config:
        from_attributes = True


# --- SERIE LOG SCHEMAS ---
class SerieLogBase(BaseModel):
    ejercicio_id: int
    numero_serie: int
    peso_kg: float
    repeticiones: int
    rpe: Optional[float] = None
    completada: bool = True
    notas: Optional[str] = None

class SerieLogCreate(SerieLogBase):
    pass

class SerieLogResponse(SerieLogBase):
    id: int
    sesion_id: int
    es_pr: bool
    ejercicio: Optional[EjercicioResponse] = None

    class Config:
        from_attributes = True


# --- SESION ENTRENAMIENTO SCHEMAS ---
class SesionCreate(BaseModel):
    nombre: str
    dia_rutina_id: Optional[int] = None
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    duracion_segundos: Optional[int] = 0
    notas: Optional[str] = None
    series: List[SerieLogCreate] = []

class SesionResponse(BaseModel):
    id: int
    nombre: str
    dia_rutina_id: Optional[int] = None
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None
    duracion_segundos: int
    notas: Optional[str] = None
    completado: bool
    series: List[SerieLogResponse] = []

    class Config:
        from_attributes = True


# --- STATS & ULTIMO REGISTRO SCHEMAS ---
class UltimoRegistroEjercicio(BaseModel):
    ejercicio_id: int
    fecha: datetime
    series: List[SerieLogResponse]

class PersonalRecord(BaseModel):
    ejercicio_id: int
    ejercicio_nombre: str
    grupo_muscular: str
    peso_maximo_kg: float
    repeticiones: int
    fecha: datetime
    sesion_id: int

class EstadisticasDashboard(BaseModel):
    total_entrenamientos: int
    racha_dias_mes: int
    volumen_semanal_kg: float
    tiempo_total_minutos: int
    ultimos_prs: List[PersonalRecord]
    ultimas_sesiones: List[SesionResponse]
