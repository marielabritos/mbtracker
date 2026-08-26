from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import Ejercicio, Rutina, DiaRutina, DiaEjercicio, SesionEntrenamiento, SerieLog

EJERCICIOS_DEFAULT = [
    # Pecho
    {"nombre": "Press de Banca Plano con Barra", "grupo_muscular": "Pecho", "equipo": "Barra", "descripcion": "Ejercicio básico para pecho y tríceps."},
    {"nombre": "Press Inclinado con Mancuernas", "grupo_muscular": "Pecho", "equipo": "Mancuerna", "descripcion": "Enfocado en la porción clavicular (pecho superior)."},
    {"nombre": "Aperturas en Polea (Cruces)", "grupo_muscular": "Pecho", "equipo": "Polea", "descripcion": "Aislamiento y congestión para pectoral."},
    {"nombre": "Fondos en Paralelas (Dips)", "grupo_muscular": "Pecho", "equipo": "Peso Corporal", "descripcion": "Excelente para pecho inferior y tríceps."},
    {"nombre": "Press en Máquina Smith / Chest Press", "grupo_muscular": "Pecho", "equipo": "Máquina", "descripcion": "Control del movimiento y máxima tensión."},

    # Espalda
    {"nombre": "Jalón al Pecho en Polea", "grupo_muscular": "Espalda", "equipo": "Polea", "descripcion": "Amplitud de dorsales."},
    {"nombre": "Dominadas (Pull-ups)", "grupo_muscular": "Espalda", "equipo": "Peso Corporal", "descripcion": "Fuerza y desarrollo dorsal global."},
    {"nombre": "Remo con Barra", "grupo_muscular": "Espalda", "equipo": "Barra", "descripcion": "Densidad y grosor de espalda media."},
    {"nombre": "Remo Unilateral con Mancuerna (Serrucho)", "grupo_muscular": "Espalda", "equipo": "Mancuerna", "descripcion": "Trabajo unilateral y rango completo."},
    {"nombre": "Remo en Polea Baja (Gironda)", "grupo_muscular": "Espalda", "equipo": "Polea", "descripcion": "Espalda media y romboides."},

    # Piernas
    {"nombre": "Sentadilla con Barra (Back Squat)", "grupo_muscular": "Piernas", "equipo": "Barra", "descripcion": "Rey de los ejercicios de pierna: cuádriceps y glúteos."},
    {"nombre": "Prensa de Piernas 45°", "grupo_muscular": "Piernas", "equipo": "Máquina", "descripcion": "Gran carga en cuádriceps sin fatiga espinal."},
    {"nombre": "Peso Muerto Rumano (RDL)", "grupo_muscular": "Piernas", "equipo": "Barra", "descripcion": "Isquiosurales y glúteos."},
    {"nombre": "Extensión de Cuádriceps", "grupo_muscular": "Piernas", "equipo": "Máquina", "descripcion": "Aislamiento total de cuádriceps."},
    {"nombre": "Curl Femoral Tumbado / Sentado", "grupo_muscular": "Piernas", "equipo": "Máquina", "descripcion": "Aislamiento de isquiotibiales."},
    {"nombre": "Elevación de Talones (Gemelos)", "grupo_muscular": "Piernas", "equipo": "Máquina", "descripcion": "Desarrollo de pantorrillas."},
    {"nombre": "Hip Thrust con Barra", "grupo_muscular": "Piernas", "equipo": "Barra", "descripcion": "Activación máxima de glúteos."},

    # Hombros
    {"nombre": "Press Militar con Barra / Mancuernas", "grupo_muscular": "Hombros", "equipo": "Mancuerna", "descripcion": "Desarrollo general de deltoides."},
    {"nombre": "Elevaciones Laterales", "grupo_muscular": "Hombros", "equipo": "Mancuerna", "descripcion": "Anchura y deltoides lateral."},
    {"nombre": "Pájaros / Face Pull en Polea", "grupo_muscular": "Hombros", "equipo": "Polea", "descripcion": "Deltoides posterior y salud escapular."},

    # Brazos (Bíceps y Tríceps)
    {"nombre": "Curl de Bíceps con Barra Z", "grupo_muscular": "Brazos", "equipo": "Barra", "descripcion": "Masa y fuerza en bíceps."},
    {"nombre": "Curl Martillo con Mancuernas", "grupo_muscular": "Brazos", "equipo": "Mancuerna", "descripcion": "Braquial y antebrazo."},
    {"nombre": "Extensiones de Tríceps en Polea (Cuerda)", "grupo_muscular": "Brazos", "equipo": "Polea", "descripcion": "Aislamiento de tríceps."},
    {"nombre": "Press Francés con Barra Z", "grupo_muscular": "Brazos", "equipo": "Barra", "descripcion": "Cabeza larga del tríceps."},

    # Core & Abdomen
    {"nombre": "Plancha Abdominal", "grupo_muscular": "Core", "equipo": "Peso Corporal", "descripcion": "Estabilidad y fuerza del core."},
    {"nombre": "Elevación de Piernas Colgado", "grupo_muscular": "Core", "equipo": "Peso Corporal", "descripcion": "Abdominales inferiores y flexores."},
    {"nombre": "Crunch en Polea Alta", "grupo_muscular": "Core", "equipo": "Polea", "descripcion": "Tensión continua en el recto abdominal."}
]

def seed_database(db: Session):
    # 1. Poblar catálogo de ejercicios si está vacío
    if db.query(Ejercicio).count() == 0:
        for ej_data in EJERCICIOS_DEFAULT:
            ej = Ejercicio(
                nombre=ej_data["nombre"],
                grupo_muscular=ej_data["grupo_muscular"],
                equipo=ej_data["equipo"],
                descripcion=ej_data["descripcion"],
                es_personalizado=False
            )
            db.add(ej)
        db.commit()

    # 2. Crear Rutina de ejemplo si no hay rutinas
    if db.query(Rutina).count() == 0:
        # Rutina Push / Pull / Legs
        rutina_ppl = Rutina(
            nombre="Rutina Push / Pull / Legs (PPL)",
            descripcion="División clásica y efectiva de 3 días para fuerza e hipertrofia."
        )
        db.add(rutina_ppl)
        db.flush()

        # Días
        dia_push = DiaRutina(nombre="Día 1: Push (Pecho, Hombro, Tríceps)", orden=1, rutina=rutina_ppl)
        dia_pull = DiaRutina(nombre="Día 2: Pull (Espalda, Deltoides Post, Bíceps)", orden=2, rutina=rutina_ppl)
        dia_legs = DiaRutina(nombre="Día 3: Legs (Pierna completa y Core)", orden=3, rutina=rutina_ppl)
        db.add_all([dia_push, dia_pull, dia_legs])
        db.flush()

        # Mapeo de ejercicios por nombre
        ej_map = {e.nombre: e.id for e in db.query(Ejercicio).all()}

        # Ejercicios Push
        push_e = [
            ("Press de Banca Plano con Barra", 4, "6-8", 120),
            ("Press Inclinado con Mancuernas", 3, "8-10", 90),
            ("Press Militar con Barra / Mancuernas", 3, "8-10", 90),
            ("Elevaciones Laterales", 4, "12-15", 60),
            ("Extensiones de Tríceps en Polea (Cuerda)", 3, "10-12", 60)
        ]
        for idx, (name, s, r, d) in enumerate(push_e, start=1):
            if name in ej_map:
                db.add(DiaEjercicio(dia_id=dia_push.id, ejercicio_id=ej_map[name], series_objetivo=s, reps_objetivo=r, descanso_segundos=d, orden=idx))

        # Ejercicios Pull
        pull_e = [
            ("Remo con Barra", 4, "6-8", 120),
            ("Jalón al Pecho en Polea", 3, "8-10", 90),
            ("Remo Unilateral con Mancuerna (Serrucho)", 3, "10-12", 90),
            ("Pájaros / Face Pull en Polea", 4, "12-15", 60),
            ("Curl de Bíceps con Barra Z", 3, "10-12", 60),
            ("Curl Martillo con Mancuernas", 3, "12-15", 60)
        ]
        for idx, (name, s, r, d) in enumerate(pull_e, start=1):
            if name in ej_map:
                db.add(DiaEjercicio(dia_id=dia_pull.id, ejercicio_id=ej_map[name], series_objetivo=s, reps_objetivo=r, descanso_segundos=d, orden=idx))

        # Ejercicios Legs
        legs_e = [
            ("Sentadilla con Barra (Back Squat)", 4, "6-8", 120),
            ("Prensa de Piernas 45°", 3, "10-12", 90),
            ("Peso Muerto Rumano (RDL)", 3, "8-10", 90),
            ("Extensión de Cuádriceps", 3, "12-15", 60),
            ("Curl Femoral Tumbado / Sentado", 3, "12-15", 60),
            ("Plancha Abdominal", 3, "45s", 45)
        ]
        for idx, (name, s, r, d) in enumerate(legs_e, start=1):
            if name in ej_map:
                db.add(DiaEjercicio(dia_id=dia_legs.id, ejercicio_id=ej_map[name], series_objetivo=s, reps_objetivo=r, descanso_segundos=d, orden=idx))

        db.commit()

    # 3. Crear algunas sesiones históricas de ejemplo si no hay ninguna
    if db.query(SesionEntrenamiento).count() == 0:
        ej_map = {e.nombre: e.id for e in db.query(Ejercicio).all()}
        ahora = datetime.utcnow()

        # Sesión hace 5 días (Push)
        if "Press de Banca Plano con Barra" in ej_map and "Press Inclinado con Mancuernas" in ej_map:
            sesion_1 = SesionEntrenamiento(
                nombre="Entrenamiento Push (Pecho & Hombro)",
                fecha_inicio=ahora - timedelta(days=5, hours=2),
                fecha_fin=ahora - timedelta(days=5, hours=1),
                duracion_segundos=3600,
                notas="Buena energía, subí 2.5kg en banca.",
                completado=True
            )
            db.add(sesion_1)
            db.flush()

            banca_id = ej_map["Press de Banca Plano con Barra"]
            db.add_all([
                SerieLog(sesion_id=sesion_1.id, ejercicio_id=banca_id, numero_serie=1, peso_kg=60.0, repeticiones=10, completada=True),
                SerieLog(sesion_id=sesion_1.id, ejercicio_id=banca_id, numero_serie=2, peso_kg=70.0, repeticiones=8, completada=True),
                SerieLog(sesion_id=sesion_1.id, ejercicio_id=banca_id, numero_serie=3, peso_kg=75.0, repeticiones=6, completada=True, es_pr=True)
            ])

            inc_id = ej_map["Press Inclinado con Mancuernas"]
            db.add_all([
                SerieLog(sesion_id=sesion_1.id, ejercicio_id=inc_id, numero_serie=1, peso_kg=22.0, repeticiones=10, completada=True),
                SerieLog(sesion_id=sesion_1.id, ejercicio_id=inc_id, numero_serie=2, peso_kg=24.0, repeticiones=8, completada=True)
            ])

        # Sesión hace 2 días (Legs)
        if "Sentadilla con Barra (Back Squat)" in ej_map:
            sesion_2 = SesionEntrenamiento(
                nombre="Día de Pierna Pesado",
                fecha_inicio=ahora - timedelta(days=2, hours=1, minutes=30),
                fecha_fin=ahora - timedelta(days=2, hours=0, minutes=45),
                duracion_segundos=2700,
                notas="Sentadillas con muy buena profundidad.",
                completado=True
            )
            db.add(sesion_2)
            db.flush()

            squat_id = ej_map["Sentadilla con Barra (Back Squat)"]
            db.add_all([
                SerieLog(sesion_id=sesion_2.id, ejercicio_id=squat_id, numero_serie=1, peso_kg=80.0, repeticiones=8, completada=True),
                SerieLog(sesion_id=sesion_2.id, ejercicio_id=squat_id, numero_serie=2, peso_kg=90.0, repeticiones=6, completada=True),
                SerieLog(sesion_id=sesion_2.id, ejercicio_id=squat_id, numero_serie=3, peso_kg=100.0, repeticiones=5, completada=True, es_pr=True)
            ])

        db.commit()
