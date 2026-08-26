from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, index=True)
    grupo_muscular = Column(String(50), nullable=False, index=True) # Pecho, Espalda, Piernas, Hombros, Brazos, Core, Cardio
    equipo = Column(String(50), nullable=True) # Barra, Mancuerna, Máquina, Polea, Peso Corporal
    descripcion = Column(Text, nullable=True)
    es_personalizado = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    series_registradas = relationship("SerieLog", back_populates="ejercicio")


class Rutina(Base):
    __tablename__ = "rutinas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    activa = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    # Relación con días de entrenamiento
    dias = relationship("DiaRutina", back_populates="rutina", cascade="all, delete-orphan", order_by="DiaRutina.orden")


class DiaRutina(Base):
    __tablename__ = "dias_rutina"

    id = Column(Integer, primary_key=True, index=True)
    rutina_id = Column(Integer, ForeignKey("rutinas.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(100), nullable=False) # Ej: Día 1: Pecho & Bíceps
    orden = Column(Integer, default=1)

    rutina = relationship("Rutina", back_populates="dias")
    ejercicios = relationship("DiaEjercicio", back_populates="dia", cascade="all, delete-orphan", order_by="DiaEjercicio.orden")


class DiaEjercicio(Base):
    __tablename__ = "dias_ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    dia_id = Column(Integer, ForeignKey("dias_rutina.id", ondelete="CASCADE"), nullable=False)
    ejercicio_id = Column(Integer, ForeignKey("ejercicios.id"), nullable=False)
    series_objetivo = Column(Integer, default=3)
    reps_objetivo = Column(String(50), default="8-12") # Ej: "10-12" o "8"
    descanso_segundos = Column(Integer, default=90)
    orden = Column(Integer, default=1)
    notas = Column(Text, nullable=True)

    dia = relationship("DiaRutina", back_populates="ejercicios")
    ejercicio = relationship("Ejercicio")


class SesionEntrenamiento(Base):
    __tablename__ = "sesiones_entrenamiento"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    dia_rutina_id = Column(Integer, ForeignKey("dias_rutina.id", ondelete="SET NULL"), nullable=True)
    fecha_inicio = Column(DateTime, default=datetime.utcnow, index=True)
    fecha_fin = Column(DateTime, nullable=True)
    duracion_segundos = Column(Integer, default=0)
    notas = Column(Text, nullable=True)
    completado = Column(Boolean, default=True)

    series = relationship("SerieLog", back_populates="sesion", cascade="all, delete-orphan")


class SerieLog(Base):
    __tablename__ = "series_log"

    id = Column(Integer, primary_key=True, index=True)
    sesion_id = Column(Integer, ForeignKey("sesiones_entrenamiento.id", ondelete="CASCADE"), nullable=False)
    ejercicio_id = Column(Integer, ForeignKey("ejercicios.id"), nullable=False)
    numero_serie = Column(Integer, nullable=False) # 1, 2, 3...
    peso_kg = Column(Float, default=0.0)
    repeticiones = Column(Integer, default=0)
    rpe = Column(Float, nullable=True) # Escala de esfuerzo percibido 1-10
    completada = Column(Boolean, default=True)
    es_pr = Column(Boolean, default=False) # Personal Record marcado
    notas = Column(Text, nullable=True)

    sesion = relationship("SesionEntrenamiento", back_populates="series")
    ejercicio = relationship("Ejercicio", back_populates="series_registradas")
