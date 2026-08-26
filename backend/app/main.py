from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routes import ejercicios, rutinas, sesiones, estadisticas

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Crear tablas de base de datos
    Base.metadata.create_all(bind=engine)
    # 2. Poblar datos iniciales si no existen
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="MBTracker API - Plataforma Personal de Entrenamiento",
    description="Backend para registro y seguimiento de entrenamientos en el gimnasio",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS para permitir peticiones desde Vite (localhost) y frontend en hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar Routers
app.include_router(ejercicios.router)
app.include_router(rutinas.router)
app.include_router(sesiones.router)
app.include_router(estadisticas.router)

@app.get("/")
def home():
    return {
        "status": "online",
        "app": "MBTracker Gym API",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
