// Cliente API Offline-First para MBTracker con persistencia dual (Local + Nube)

export const DEFAULT_EJERCICIOS = [
  // --- PECHO ---
  { id: 1, nombre: "Press de Banca Plano con Barra", grupo_muscular: "Pecho", equipo: "Barra", es_personalizado: false },
  { id: 2, nombre: "Press de Banca Plano con Mancuernas", grupo_muscular: "Pecho", equipo: "Mancuerna", es_personalizado: false },
  { id: 3, nombre: "Press Inclinado con Barra", grupo_muscular: "Pecho", equipo: "Barra", es_personalizado: false },
  { id: 4, nombre: "Press Inclinado con Mancuernas", grupo_muscular: "Pecho", equipo: "Mancuerna", es_personalizado: false },
  { id: 5, nombre: "Press Declinado con Barra / Mancuernas", grupo_muscular: "Pecho", equipo: "Barra", es_personalizado: false },
  { id: 6, nombre: "Aperturas en Polea (Cruces)", grupo_muscular: "Pecho", equipo: "Polea", es_personalizado: false },
  { id: 7, nombre: "Aperturas con Mancuernas en Banco Plano", grupo_muscular: "Pecho", equipo: "Mancuerna", es_personalizado: false },
  { id: 8, nombre: "Aperturas con Mancuernas en Banco Inclinado", grupo_muscular: "Pecho", equipo: "Mancuerna", es_personalizado: false },
  { id: 9, nombre: "Fondos en Paralelas (Dips)", grupo_muscular: "Pecho", equipo: "Peso Corporal", es_personalizado: false },
  { id: 10, nombre: "Flexiones de pecho (Push-ups)", grupo_muscular: "Pecho", equipo: "Peso Corporal", es_personalizado: false },
  { id: 11, nombre: "Press en Máquina Smith / Chest Press", grupo_muscular: "Pecho", equipo: "Máquina", es_personalizado: false },
  { id: 12, nombre: "Pec Deck / Contractor de Pecho", grupo_muscular: "Pecho", equipo: "Máquina", es_personalizado: false },
  { id: 13, nombre: "Pullover con Mancuerna", grupo_muscular: "Pecho", equipo: "Mancuerna", es_personalizado: false },

  // --- ESPALDA ---
  { id: 14, nombre: "Jalón al Pecho en Polea", grupo_muscular: "Espalda", equipo: "Polea", es_personalizado: false },
  { id: 15, nombre: "Jalón al Pecho Agarre Supino / Estrecho", grupo_muscular: "Espalda", equipo: "Polea", es_personalizado: false },
  { id: 16, nombre: "Dominadas (Pull-ups)", grupo_muscular: "Espalda", equipo: "Peso Corporal", es_personalizado: false },
  { id: 17, nombre: "Dominadas Supinas (Chin-ups)", grupo_muscular: "Espalda", equipo: "Peso Corporal", es_personalizado: false },
  { id: 18, nombre: "Remo con Barra", grupo_muscular: "Espalda", equipo: "Barra", es_personalizado: false },
  { id: 19, nombre: "Remo Unilateral con Mancuerna (Serrucho)", grupo_muscular: "Espalda", equipo: "Mancuerna", es_personalizado: false },
  { id: 20, nombre: "Remo en Polea Baja (Gironda)", grupo_muscular: "Espalda", equipo: "Polea", es_personalizado: false },
  { id: 21, nombre: "Remo en Barra T / Con Apoyo en Pecho", grupo_muscular: "Espalda", equipo: "Barra", es_personalizado: false },
  { id: 22, nombre: "Remo en Máquina / Chest Supported Row", grupo_muscular: "Espalda", equipo: "Máquina", es_personalizado: false },
  { id: 23, nombre: "Pullover en Polea Alta con Cuerda / Barra", grupo_muscular: "Espalda", equipo: "Polea", es_personalizado: false },
  { id: 24, nombre: "Peso Muerto Convencional", grupo_muscular: "Espalda", equipo: "Barra", es_personalizado: false },
  { id: 25, nombre: "Hiperextensiones Lumbares", grupo_muscular: "Espalda", equipo: "Banco", es_personalizado: false },

  // --- GLÚTEOS VARIADOS (CATEGORÍA DEDICADA) ---
  { id: 26, nombre: "Hip Thrust con Barra", grupo_muscular: "Glúteos", equipo: "Barra", es_personalizado: false },
  { id: 27, nombre: "Kas Glute Bridge con Barra", grupo_muscular: "Glúteos", equipo: "Barra", es_personalizado: false },
  { id: 28, nombre: "Hip Thrust Unilateral con Mancuerna", grupo_muscular: "Glúteos", equipo: "Mancuerna", es_personalizado: false },
  { id: 29, nombre: "Glute Bridge / Puente de Glúteo en Suelo", grupo_muscular: "Glúteos", equipo: "Peso Corporal / Barra", es_personalizado: false },
  { id: 30, nombre: "Sentadilla Búlgara Enfocada a Glúteo", grupo_muscular: "Glúteos", equipo: "Mancuerna", es_personalizado: false },
  { id: 31, nombre: "Patada de Glúteo en Polea (Cable Kickback)", grupo_muscular: "Glúteos", equipo: "Polea", es_personalizado: false },
  { id: 32, nombre: "Patada de Glúteo en Máquina / Cuadrupedia", grupo_muscular: "Glúteos", equipo: "Máquina", es_personalizado: false },
  { id: 33, nombre: "Abducciones de Cadera en Máquina", grupo_muscular: "Glúteos", equipo: "Máquina", es_personalizado: false },
  { id: 34, nombre: "Abducciones de Cadera en Polea de Pie", grupo_muscular: "Glúteos", equipo: "Polea", es_personalizado: false },
  { id: 35, nombre: "Abducciones con Banda Elástica Sentada", grupo_muscular: "Glúteos", equipo: "Banda Elástica", es_personalizado: false },
  { id: 36, nombre: "Clamshells / Almejas con Banda", grupo_muscular: "Glúteos", equipo: "Banda Elástica", es_personalizado: false },
  { id: 37, nombre: "Monster Walk / Pasos Laterales con Banda", grupo_muscular: "Glúteos", equipo: "Banda Elástica", es_personalizado: false },
  { id: 38, nombre: "Frog Pumps con Mancuerna", grupo_muscular: "Glúteos", equipo: "Mancuerna", es_personalizado: false },
  { id: 39, nombre: "Cable Pull-Through en Polea Baja", grupo_muscular: "Glúteos", equipo: "Polea", es_personalizado: false },
  { id: 40, nombre: "Peso Muerto Rumano Unilateral (B-Stance RDL)", grupo_muscular: "Glúteos", equipo: "Mancuerna", es_personalizado: false },
  { id: 41, nombre: "Sentadilla Sumo con Mancuerna / Kettlebell", grupo_muscular: "Glúteos", equipo: "Mancuerna", es_personalizado: false },
  { id: 42, nombre: "Step-Ups en Cajón para Glúteo", grupo_muscular: "Glúteos", equipo: "Mancuerna", es_personalizado: false },
  { id: 43, nombre: "Hiperextensiones a 45° Enfocadas a Glúteo", grupo_muscular: "Glúteos", equipo: "Banco", es_personalizado: false },
  { id: 44, nombre: "Zancadas Invertidas para Glúteo", grupo_muscular: "Glúteos", equipo: "Mancuerna", es_personalizado: false },

  // --- PIERNAS (CUÁDRICEPS, ISQUIOS, GEMELOS) ---
  { id: 45, nombre: "Sentadilla con Barra (Back Squat)", grupo_muscular: "Piernas", equipo: "Barra", es_personalizado: false },
  { id: 46, nombre: "Sentadilla Frontal con Barra (Front Squat)", grupo_muscular: "Piernas", equipo: "Barra", es_personalizado: false },
  { id: 47, nombre: "Sentadilla Goblet con Mancuerna", grupo_muscular: "Piernas", equipo: "Mancuerna", es_personalizado: false },
  { id: 48, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 49, nombre: "Hack Squat / Sentadilla Hack", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 50, nombre: "Extensión de Cuádriceps", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 51, nombre: "Zancadas / Estocadas Caminando", grupo_muscular: "Piernas", equipo: "Mancuerna", es_personalizado: false },
  { id: 52, nombre: "Peso Muerto Rumano con Barra (RDL)", grupo_muscular: "Piernas", equipo: "Barra", es_personalizado: false },
  { id: 53, nombre: "Peso Muerto Rumano con Mancuernas", grupo_muscular: "Piernas", equipo: "Mancuerna", es_personalizado: false },
  { id: 54, nombre: "Peso Muerto Sumo", grupo_muscular: "Piernas", equipo: "Barra", es_personalizado: false },
  { id: 55, nombre: "Curl Femoral Tumbado en Máquina", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 56, nombre: "Curl Femoral Sentado en Máquina", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 57, nombre: "Aductores en Máquina", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 58, nombre: "Elevación de Talones (Gemelos de Pie)", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 59, nombre: "Elevación de Talones Sentado (Sóleo)", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },
  { id: 120, nombre: "Pantorrilla en Prensa 45°", grupo_muscular: "Piernas", equipo: "Máquina", es_personalizado: false },

  // --- HOMBROS ---
  { id: 60, nombre: "Press Militar con Barra / Mancuernas", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },
  { id: 61, nombre: "Press Militar de Pie con Barra", grupo_muscular: "Hombros", equipo: "Barra", es_personalizado: false },
  { id: 62, nombre: "Press Arnold con Mancuernas", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },
  { id: 63, nombre: "Elevaciones Laterales con Mancuernas", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },
  { id: 64, nombre: "Elevaciones Laterales en Polea", grupo_muscular: "Hombros", equipo: "Polea", es_personalizado: false },
  { id: 65, nombre: "Elevaciones Frontales con Mancuernas / Disco", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },
  { id: 66, nombre: "Pájaros / Face Pull en Polea", grupo_muscular: "Hombros", equipo: "Polea", es_personalizado: false },
  { id: 67, nombre: "Pájaros con Mancuernas (Deltoides Posterior)", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },
  { id: 68, nombre: "Remo al Mentón con Barra Z / Polea", grupo_muscular: "Hombros", equipo: "Barra", es_personalizado: false },
  { id: 69, nombre: "Encogimientos de Trapecio (Shrugs)", grupo_muscular: "Hombros", equipo: "Mancuerna", es_personalizado: false },

  // --- BRAZOS (BÍCEPS, TRÍCEPS, ANTEBRAZOS) ---
  { id: 70, nombre: "Curl de Bíceps con Barra Z", grupo_muscular: "Brazos", equipo: "Barra", es_personalizado: false },
  { id: 71, nombre: "Curl de Bíceps Alterno con Mancuernas", grupo_muscular: "Brazos", equipo: "Mancuerna", es_personalizado: false },
  { id: 72, nombre: "Curl Martillo con Mancuernas", grupo_muscular: "Brazos", equipo: "Mancuerna", es_personalizado: false },
  { id: 73, nombre: "Curl en Banco Inclinado con Mancuernas", grupo_muscular: "Brazos", equipo: "Mancuerna", es_personalizado: false },
  { id: 74, nombre: "Curl en Banco Scott / Predicador", grupo_muscular: "Brazos", equipo: "Barra", es_personalizado: false },
  { id: 75, nombre: "Curl Concentrado con Mancuerna", grupo_muscular: "Brazos", equipo: "Mancuerna", es_personalizado: false },
  { id: 76, nombre: "Curl de Bíceps en Polea Baja", grupo_muscular: "Brazos", equipo: "Polea", es_personalizado: false },
  { id: 77, nombre: "Extensiones de Tríceps en Polea (Cuerda)", grupo_muscular: "Brazos", equipo: "Polea", es_personalizado: false },
  { id: 78, nombre: "Extensiones de Tríceps en Polea (Barra Recta)", grupo_muscular: "Brazos", equipo: "Polea", es_personalizado: false },
  { id: 79, nombre: "Press Francés con Barra Z", grupo_muscular: "Brazos", equipo: "Barra", es_personalizado: false },
  { id: 80, nombre: "Extensión de Tríceps sobre la Cabeza (Copa)", grupo_muscular: "Brazos", equipo: "Mancuerna", es_personalizado: false },
  { id: 81, nombre: "Fondos entre Bancos para Tríceps", grupo_muscular: "Brazos", equipo: "Peso Corporal", es_personalizado: false },
  { id: 82, nombre: "Patada de Tríceps con Mancuerna / Polea", grupo_muscular: "Brazos", equipo: "Mancuerna", es_personalizado: false },
  { id: 83, nombre: "Curl de Muñeca Supino / Pronado (Antebrazos)", grupo_muscular: "Brazos", equipo: "Barra", es_personalizado: false },

  // --- CORE / ABDOMEN ---
  { id: 84, nombre: "Plancha Abdominal", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 85, nombre: "Plancha Lateral (Side Plank)", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 86, nombre: "Elevación de Piernas Colgado", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 87, nombre: "Elevación de Piernas en Suelo / Banco", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 88, nombre: "Crunch en Polea Alta", grupo_muscular: "Core", equipo: "Polea", es_personalizado: false },
  { id: 89, nombre: "Crunch Abdominal Clásico en Suelo", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 90, nombre: "Rueda Abdominal (Ab Wheel)", grupo_muscular: "Core", equipo: "Rueda Abdominal", es_personalizado: false },
  { id: 91, nombre: "Russian Twists / Giros Rusos", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },
  { id: 92, nombre: "Vacío Abdominal (Stomach Vacuum)", grupo_muscular: "Core", equipo: "Peso Corporal", es_personalizado: false },

  // --- CALENTAMIENTO Y MOVILIDAD ---
  { id: 93, nombre: "Dislocaciones de Hombro con Banda / Pica", grupo_muscular: "Calentamiento", equipo: "Banda Elástica", es_personalizado: false },
  { id: 94, nombre: "Gato-Camello (Cat-Cow) Columna", grupo_muscular: "Calentamiento", equipo: "Peso Corporal", es_personalizado: false },
  { id: 95, nombre: "Rotación Torácica en Cuadrupedia", grupo_muscular: "Calentamiento", equipo: "Peso Corporal", es_personalizado: false },
  { id: 96, nombre: "Apertura de Cadera en 90/90", grupo_muscular: "Calentamiento", equipo: "Peso Corporal", es_personalizado: false },
  { id: 97, nombre: "Círculos de Brazos y Hombros", grupo_muscular: "Calentamiento", equipo: "Peso Corporal", es_personalizado: false },
  { id: 98, nombre: "Movilidad de Cadera en Estocada Dinámica", grupo_muscular: "Calentamiento", equipo: "Peso Corporal", es_personalizado: false },

  // --- REHABILITACIÓN Y SALUD ARTICULAR ---
  { id: 99, nombre: "Sentadilla Isométrica en Pared (Wall Sit)", grupo_muscular: "Rehabilitación", equipo: "Peso Corporal", es_personalizado: false },
  { id: 100, nombre: "Extensiones Terminales de Rodilla con Banda (TKE)", grupo_muscular: "Rehabilitación", equipo: "Banda Elástica", es_personalizado: false },
  { id: 101, nombre: "Puente de Glúteo Unipodal", grupo_muscular: "Rehabilitación", equipo: "Peso Corporal", es_personalizado: false },
  { id: 102, nombre: "Clamshells / Almejas con Banda", grupo_muscular: "Rehabilitación", equipo: "Banda Elástica", es_personalizado: false },
  { id: 103, nombre: "Monster Walk / Pasos con Banda", grupo_muscular: "Rehabilitación", equipo: "Banda Elástica", es_personalizado: false },
  { id: 104, nombre: "Dorsiflexión de Tobillo en Pared", grupo_muscular: "Rehabilitación", equipo: "Peso Corporal", es_personalizado: false },
  { id: 105, nombre: "Elevación de Gemelos Excéntrica a 1 Pierna", grupo_muscular: "Rehabilitación", equipo: "Peso Corporal", es_personalizado: false },
  { id: 106, nombre: "Caminata en Talones y Puntas", grupo_muscular: "Rehabilitación", equipo: "Peso Corporal", es_personalizado: false },

  // --- ESTIRAMIENTOS Y FLEXIBILIDAD ---
  { id: 107, nombre: "Estiramiento de Isquiosurales en Suelo", grupo_muscular: "Estiramientos", equipo: "Peso Corporal", es_personalizado: false },
  { id: 108, nombre: "Estiramiento de Cuádriceps y Psoas", grupo_muscular: "Estiramientos", equipo: "Peso Corporal", es_personalizado: false },
  { id: 109, nombre: "Posición del Niño (Child's Pose)", grupo_muscular: "Estiramientos", equipo: "Peso Corporal", es_personalizado: false },
  { id: 110, nombre: "Cobra / Extensión Lumbar Suave", grupo_muscular: "Estiramientos", equipo: "Peso Corporal", es_personalizado: false },
  { id: 111, nombre: "Estiramiento Pectoral en Pared", grupo_muscular: "Estiramientos", equipo: "Peso Corporal", es_personalizado: false },
  { id: 112, nombre: "Estiramiento de Glúteo y Piramidal en Suelo", grupo_muscular: "Estiramientos", equipo: "Peso Corporal", es_personalizado: false },
  { id: 113, nombre: "Estiramiento de Dorsales en Barra / Pared", grupo_muscular: "Estiramientos", equipo: "Peso Corporal", es_personalizado: false },

    { id: 130, nombre: "Empuje en Polea para Pecho", grupo_muscular: "Pecho", equipo: "Polea", es_personalizado: false },
  { id: 131, nombre: "Face Pull en Polea con Cuerda (Pull Face)", grupo_muscular: "Hombros", equipo: "Polea", es_personalizado: false },
    { id: 132, nombre: "Press Pallof en Polea", grupo_muscular: "Core", equipo: "Polea", es_personalizado: false },
  { id: 133, nombre: "Caminata de Granjero con Mancuernas (Farmer's Walk)", grupo_muscular: "Core", equipo: "Mancuerna", es_personalizado: false },
  // --- CARDIO, RUNNING, BICICLETA & MONTAÑISMO ---
  { id: 114, nombre: "Carrera / Running Continuo", grupo_muscular: "Cardio", equipo: "Aire Libre / Cinta", es_personalizado: false },
  { id: 115, nombre: "Series de Velocidad / Intervalos Running", grupo_muscular: "Cardio", equipo: "Aire Libre", es_personalizado: false },
  { id: 116, nombre: "Ciclismo en Ruta / Bicicleta", grupo_muscular: "Cardio", equipo: "Bicicleta", es_personalizado: false },
  { id: 117, nombre: "Spinning / Bici Estática", grupo_muscular: "Cardio", equipo: "Bicicleta Estática", es_personalizado: false },
  { id: 118, nombre: "Trekking / Senderismo con Desnivel", grupo_muscular: "Montañismo", equipo: "Montaña / Bastones", es_personalizado: false },
  { id: 119, nombre: "Montañismo con Mochila (Rucking)", grupo_muscular: "Montañismo", equipo: "Mochila con Peso", es_personalizado: false }
];

export const DEFAULT_RUTINAS = [
  {
    id: 1002,
    nombre: "Rutina Full Body (Cuerpo Completo)",
    descripcion: "Fuerza, tono y masa muscular global con empuje en polea, press mancuernas, jalón supino, face pull, hip thrust, femoral sentado, pallof y caminata de granjero.",
    duracion_semanas: "6 semanas",
    duracion_estimada_minutos: 60,
    activa: true,
    dias: [
      {
        id: 2001,
        nombre: "Día 1: Full Body Fuerza, Tren Superior & Inferior Completo",
        orden: 1,
        ejercicios: [
          { id: 201, ejercicio_id: 130, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 1, ejercicio: { id: 130, nombre: "Empuje en Polea para Pecho", grupo_muscular: "Pecho", equipo: "Polea" } },
          { id: 202, ejercicio_id: 2, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 2, ejercicio: { id: 2, nombre: "Press de Banca Plano con Mancuernas", grupo_muscular: "Pecho", equipo: "Mancuerna" } },
          { id: 203, ejercicio_id: 15, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 3, ejercicio: { id: 15, nombre: "Jalón al Pecho Agarre Supino / Estrecho", grupo_muscular: "Espalda", equipo: "Polea" } },
          { id: 204, ejercicio_id: 131, series_objetivo: 3, reps_objetivo: "12-15", descanso_segundos: 60, orden: 4, ejercicio: { id: 131, nombre: "Face Pull en Polea con Cuerda (Pull Face)", grupo_muscular: "Hombros", equipo: "Polea" } },
          { id: 205, ejercicio_id: 26, series_objetivo: 4, reps_objetivo: "8-10", descanso_segundos: 120, orden: 5, ejercicio: { id: 26, nombre: "Hip Thrust con Barra", grupo_muscular: "Glúteos", equipo: "Barra" } },
          { id: 206, ejercicio_id: 48, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 6, ejercicio: { id: 48, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas", equipo: "Máquina" } },
          { id: 207, ejercicio_id: 56, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 7, ejercicio: { id: 56, nombre: "Curl Femoral Sentado en Máquina", grupo_muscular: "Piernas", equipo: "Máquina" } },
          { id: 208, ejercicio_id: 132, series_objetivo: 3, reps_objetivo: "12-15", descanso_segundos: 60, orden: 8, ejercicio: { id: 132, nombre: "Press Pallof en Polea", grupo_muscular: "Core", equipo: "Polea" } },
          { id: 209, ejercicio_id: 133, series_objetivo: 3, reps_objetivo: "40-50m", descanso_segundos: 60, orden: 9, ejercicio: { id: 133, nombre: "Caminata de Granjero con Mancuernas (Farmer's Walk)", grupo_muscular: "Core", equipo: "Mancuerna" } },
          { id: 210, ejercicio_id: 77, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 60, orden: 10, ejercicio: { id: 77, nombre: "Extensiones de Tríceps en Polea (Cuerda)", grupo_muscular: "Brazos", equipo: "Polea" } },
          { id: 211, ejercicio_id: 84, series_objetivo: 3, reps_objetivo: "45s", descanso_segundos: 60, orden: 11, ejercicio: { id: 84, nombre: "Plancha Abdominal", grupo_muscular: "Core", equipo: "Peso Corporal" } }
        ]
      }
    ]
  },
  {
    id: 10,
    nombre: "Tren Inferior - Glúteos, cuadriceps, pantorillas",
    descripcion: "Hipertrofia y carga progresiva",
    duracion_semanas: "4 semanas",
    duracion_estimada_minutos: 50,
    activa: true,
    dias: [
      {
        id: 1001,
        nombre: "Día 1",
        orden: 1,
        ejercicios: [
          { id: 101, ejercicio_id: 48, series_objetivo: 3, reps_objetivo: "8-12", descanso_segundos: 90, orden: 1, ejercicio: { id: 48, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas", equipo: "Máquina" } },
          { id: 102, ejercicio_id: 120, series_objetivo: 3, reps_objetivo: "8-12", descanso_segundos: 90, orden: 2, ejercicio: { id: 120, nombre: "Pantorrilla en Prensa 45°", grupo_muscular: "Piernas", equipo: "Máquina" } },
          { id: 103, ejercicio_id: 26, series_objetivo: 3, reps_objetivo: "8-12", descanso_segundos: 90, orden: 3, ejercicio: { id: 26, nombre: "Hip Thrust con Barra", grupo_muscular: "Glúteos", equipo: "Barra" } },
          { id: 104, ejercicio_id: 33, series_objetivo: 3, reps_objetivo: "8-12", descanso_segundos: 90, orden: 4, ejercicio: { id: 33, nombre: "Abducciones de Cadera en Máquina", grupo_muscular: "Glúteos", equipo: "Máquina" } },
          { id: 105, ejercicio_id: 58, series_objetivo: 3, reps_objetivo: "8-12", descanso_segundos: 90, orden: 5, ejercicio: { id: 58, nombre: "Elevación de Talones (Gemelos de Pie)", grupo_muscular: "Piernas", equipo: "Máquina" } },
          { id: 106, ejercicio_id: 77, series_objetivo: 3, reps_objetivo: "8-12", descanso_segundos: 90, orden: 6, ejercicio: { id: 77, nombre: "Extensiones de Tríceps en Polea (Cuerda)", grupo_muscular: "Brazos", equipo: "Polea" } },
          { id: 107, ejercicio_id: 81, series_objetivo: 3, reps_objetivo: "8-12", descanso_segundos: 90, orden: 7, ejercicio: { id: 81, nombre: "Fondos entre Bancos para Tríceps", grupo_muscular: "Brazos", equipo: "Peso Corporal" } }
        ]
      }
    ]
  },
  {
    id: 1,
    nombre: "Rutina Push / Pull / Legs + Glúteos (PPL)",
    descripcion: "División de 3 días para fuerza, hipertrofia de tren superior y desarrollo de glúteos y piernas.",
    duracion_semanas: "6 semanas",
    duracion_estimada_minutos: 55,
    activa: true,
    dias: [
      {
        id: 101,
        nombre: "Día 1: Push (Pecho, Hombro, Tríceps)",
        orden: 1,
        ejercicios: [
          { id: 1, ejercicio_id: 1, series_objetivo: 4, reps_objetivo: "6-8", descanso_segundos: 120, orden: 1, ejercicio: DEFAULT_EJERCICIOS[0] },
          { id: 2, ejercicio_id: 4, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 2, ejercicio: DEFAULT_EJERCICIOS[3] },
          { id: 3, ejercicio_id: 60, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 3, ejercicio: DEFAULT_EJERCICIOS[59] },
          { id: 4, ejercicio_id: 63, series_objetivo: 4, reps_objetivo: "12-15", descanso_segundos: 60, orden: 4, ejercicio: DEFAULT_EJERCICIOS[62] },
          { id: 5, ejercicio_id: 77, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 60, orden: 5, ejercicio: DEFAULT_EJERCICIOS[76] },
        ]
      },
      {
        id: 102,
        nombre: "Día 2: Pull (Espalda, Deltoides Post, Bíceps)",
        orden: 2,
        ejercicios: [
          { id: 6, ejercicio_id: 18, series_objetivo: 4, reps_objetivo: "6-8", descanso_segundos: 120, orden: 1, ejercicio: DEFAULT_EJERCICIOS[17] },
          { id: 7, ejercicio_id: 14, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 2, ejercicio: DEFAULT_EJERCICIOS[13] },
          { id: 8, ejercicio_id: 19, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 3, ejercicio: DEFAULT_EJERCICIOS[18] },
          { id: 9, ejercicio_id: 20, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 4, ejercicio: DEFAULT_EJERCICIOS[19] },
          { id: 10, ejercicio_id: 66, series_objetivo: 4, reps_objetivo: "12-15", descanso_segundos: 60, orden: 5, ejercicio: DEFAULT_EJERCICIOS[65] },
          { id: 11, ejercicio_id: 70, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 60, orden: 6, ejercicio: DEFAULT_EJERCICIOS[69] },
        ]
      },
      {
        id: 103,
        nombre: "Día 3: Glúteos & Legs (Hip Thrust, Búlgara, Cuádriceps)",
        orden: 3,
        ejercicios: [
          { id: 12, ejercicio_id: 26, series_objetivo: 4, reps_objetivo: "8-10", descanso_segundos: 120, orden: 1, ejercicio: DEFAULT_EJERCICIOS[25] },
          { id: 13, ejercicio_id: 30, series_objetivo: 3, reps_objetivo: "10-12", descanso_segundos: 90, orden: 2, ejercicio: DEFAULT_EJERCICIOS[29] },
          { id: 14, ejercicio_id: 45, series_objetivo: 3, reps_objetivo: "8-10", descanso_segundos: 90, orden: 3, ejercicio: DEFAULT_EJERCICIOS[44] },
          { id: 15, ejercicio_id: 33, series_objetivo: 4, reps_objetivo: "12-15", descanso_segundos: 60, orden: 4, ejercicio: DEFAULT_EJERCICIOS[32] },
          { id: 16, ejercicio_id: 31, series_objetivo: 3, reps_objetivo: "12-15", descanso_segundos: 60, orden: 5, ejercicio: DEFAULT_EJERCICIOS[30] },
          { id: 17, ejercicio_id: 84, series_objetivo: 3, reps_objetivo: "45s", descanso_segundos: 60, orden: 6, ejercicio: DEFAULT_EJERCICIOS[83] },
        ]
      }
    ]
  }
];

const getApiBase = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.includes('vercel.app')) {
      return `http://${host}:8080`;
    }
  }
  return 'http://localhost:8080';
};

const API_BASE = getApiBase();

const memoryStore = {};

const getStored = (key, defaultVal) => {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(`mbtracker_${key}`);
      return val ? JSON.parse(val) : defaultVal;
    }
  } catch (e) {}
  return memoryStore[key] !== undefined ? memoryStore[key] : defaultVal;
};

const setStored = (key, val) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`mbtracker_${key}`, JSON.stringify(val));
    }
  } catch (e) {
    console.warn("Storage full or blocked", e);
  }
  memoryStore[key] = val;
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: controller.signal,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const DEFAULT_SESIONES_HISTORIAL = [
  {
    id: 1724700000000,
    nombre: "Rutina Full Body (Cuerpo Completo)",
    tipo: "gimnasio",
    fecha_inicio: "2026-08-26T18:00:00.000Z",
    fecha_fin: "2026-08-26T18:50:00.000Z",
    duracion_segundos: 3000,
    duracion_minutos: 50,
    animo: { emoji: "🔥", label: "A tope", nivel: 5 },
    energia: 5,
    checkin_notas: "Inicio de ciclo de entrenamiento en gimnasio (26-08)",
    completado: true,
    series: [
      { id: 1, ejercicio_id: 130, numero_serie: 1, peso_kg: 20, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 130, nombre: "Empuje en Polea para Pecho", grupo_muscular: "Pecho" } },
      { id: 2, ejercicio_id: 130, numero_serie: 2, peso_kg: 25, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 130, nombre: "Empuje en Polea para Pecho", grupo_muscular: "Pecho" } },
      { id: 3, ejercicio_id: 2, numero_serie: 1, peso_kg: 12, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 2, nombre: "Press de Banca Plano con Mancuernas", grupo_muscular: "Pecho" } },
      { id: 4, ejercicio_id: 2, numero_serie: 2, peso_kg: 14, repeticiones: 8, completada: true, es_pr: true, ejercicio: { id: 2, nombre: "Press de Banca Plano con Mancuernas", grupo_muscular: "Pecho" } },
      { id: 5, ejercicio_id: 15, numero_serie: 1, peso_kg: 35, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 15, nombre: "Jalón al Pecho Agarre Supino / Estrecho", grupo_muscular: "Espalda" } },
      { id: 6, ejercicio_id: 15, numero_serie: 2, peso_kg: 40, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 15, nombre: "Jalón al Pecho Agarre Supino / Estrecho", grupo_muscular: "Espalda" } },
      { id: 7, ejercicio_id: 131, numero_serie: 1, peso_kg: 15, repeticiones: 15, completada: true, es_pr: true, ejercicio: { id: 131, nombre: "Face Pull en Polea con Cuerda (Pull Face)", grupo_muscular: "Hombros" } },
      { id: 8, ejercicio_id: 26, numero_serie: 1, peso_kg: 50, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 26, nombre: "Hip Thrust con Barra", grupo_muscular: "Glúteos" } },
      { id: 9, ejercicio_id: 26, numero_serie: 2, peso_kg: 60, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 26, nombre: "Hip Thrust con Barra", grupo_muscular: "Glúteos" } },
      { id: 10, ejercicio_id: 48, numero_serie: 1, peso_kg: 80, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 48, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas" } },
      { id: 11, ejercicio_id: 48, numero_serie: 2, peso_kg: 100, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 48, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas" } }
    ]
  },
  {
    id: 1724872800000,
    nombre: "Rutina Push / Pull (Fuerza & Tren Superior)",
    tipo: "gimnasio",
    fecha_inicio: "2026-08-28T18:00:00.000Z",
    fecha_fin: "2026-08-28T18:55:00.000Z",
    duracion_segundos: 3300,
    duracion_minutos: 55,
    animo: { emoji: "⚡", label: "Con energía", nivel: 4 },
    energia: 4,
    checkin_notas: "Día 2: Buen foco en empuje y tracción (28-08)",
    completado: true,
    series: [
      { id: 12, ejercicio_id: 1, numero_serie: 1, peso_kg: 30, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 1, nombre: "Press de Banca Plano con Barra", grupo_muscular: "Pecho" } },
      { id: 13, ejercicio_id: 1, numero_serie: 2, peso_kg: 35, repeticiones: 8, completada: true, es_pr: true, ejercicio: { id: 1, nombre: "Press de Banca Plano con Barra", grupo_muscular: "Pecho" } },
      { id: 14, ejercicio_id: 60, numero_serie: 1, peso_kg: 10, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 60, nombre: "Press Militar con Mancuernas", grupo_muscular: "Hombros" } },
      { id: 15, ejercicio_id: 63, numero_serie: 1, peso_kg: 6, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 63, nombre: "Elevaciones Laterales con Mancuernas", grupo_muscular: "Hombros" } },
      { id: 16, ejercicio_id: 18, numero_serie: 1, peso_kg: 35, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 18, nombre: "Remo con Barra", grupo_muscular: "Espalda" } },
      { id: 17, ejercicio_id: 77, numero_serie: 1, peso_kg: 15, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 77, nombre: "Extensiones de Tríceps en Polea (Cuerda)", grupo_muscular: "Brazos" } }
    ]
  },
  {
    id: 1725132000000,
    nombre: "Tren Inferior - Glúteos, cuadriceps, pantorillas",
    tipo: "gimnasio",
    fecha_inicio: "2026-08-31T18:00:00.000Z",
    fecha_fin: "2026-08-31T18:52:00.000Z",
    duracion_segundos: 3120,
    duracion_minutos: 52,
    animo: { emoji: "🔥", label: "A tope", nivel: 5 },
    energia: 5,
    checkin_notas: "Día 3: Gran congestión de glúteos y cuádriceps (31-08)",
    completado: true,
    series: [
      { id: 18, ejercicio_id: 48, numero_serie: 1, peso_kg: 80, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 48, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas" } },
      { id: 19, ejercicio_id: 48, numero_serie: 2, peso_kg: 100, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 48, nombre: "Prensa de Piernas 45°", grupo_muscular: "Piernas" } },
      { id: 20, ejercicio_id: 120, numero_serie: 1, peso_kg: 60, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 120, nombre: "Pantorrilla en Prensa 45°", grupo_muscular: "Piernas" } },
      { id: 21, ejercicio_id: 26, numero_serie: 1, peso_kg: 60, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 26, nombre: "Hip Thrust con Barra", grupo_muscular: "Glúteos" } },
      { id: 22, ejercicio_id: 26, numero_serie: 2, peso_kg: 70, repeticiones: 8, completada: true, es_pr: true, ejercicio: { id: 26, nombre: "Hip Thrust con Barra", grupo_muscular: "Glúteos" } },
      { id: 23, ejercicio_id: 33, numero_serie: 1, peso_kg: 50, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 33, nombre: "Abducciones de Cadera en Máquina", grupo_muscular: "Glúteos" } },
      { id: 24, ejercicio_id: 58, numero_serie: 1, peso_kg: 40, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 58, nombre: "Elevación de Talones (Gemelos de Pie)", grupo_muscular: "Piernas" } },
      { id: 25, ejercicio_id: 77, numero_serie: 1, peso_kg: 17.5, repeticiones: 10, completada: true, es_pr: true, ejercicio: { id: 77, nombre: "Extensiones de Tríceps en Polea (Cuerda)", grupo_muscular: "Brazos" } },
      { id: 26, ejercicio_id: 81, numero_serie: 1, peso_kg: 0, repeticiones: 12, completada: true, es_pr: true, ejercicio: { id: 81, nombre: "Fondos entre Bancos para Tríceps", grupo_muscular: "Brazos" } }
    ]
  }
];

export const api = {
  // --- ESTADÍSTICAS & DASHBOARD ---
  getDashboardStats: async () => {
    const sesiones = getStored('sesiones', []);
    const prs = getStored('prs', []);
    const totalVolumen = sesiones.reduce((acc, s) => {
      return acc + (s.series || []).reduce((sAcc, item) => sAcc + ((parseFloat(item.peso_kg) || 0) * (parseInt(item.repeticiones) || 0)), 0);
    }, 0);

    const localStats = {
      total_entrenamientos: sesiones.length,
      racha_dias_mes: sesiones.length > 0 ? Math.min(sesiones.length, 30) : 0,
      volumen_semanal_kg: Math.round(totalVolumen),
      tiempo_total_minutos: Math.round(sesiones.reduce((acc, s) => acc + (parseInt(s.duracion_segundos) || 0), 0) / 60),
      ultimos_prs: prs.slice(0, 8),
      ultimas_sesiones: sesiones.slice(0, 5)
    };

    setStored('dashboard_stats', localStats);

    try {
      const data = await request('/api/estadisticas/dashboard');
      if (data && data.total_entrenamientos > 0) {
        return {
          ...data,
          total_entrenamientos: Math.max(data.total_entrenamientos, localStats.total_entrenamientos),
          volumen_semanal_kg: Math.max(data.volumen_semanal_kg, localStats.volumen_semanal_kg)
        };
      }
    } catch (e) {}

    return localStats;
  },

  getProgresoEjercicio: async (ejercicioId) => {
    const sesiones = getStored('sesiones', []);
    const series = [];
    const sorted = [...sesiones].sort((a, b) => new Date(a.fecha_inicio || a.fecha || 0) - new Date(b.fecha_inicio || b.fecha || 0));

    sorted.forEach(s => {
      const matches = (s.series || []).filter(item => item.ejercicio_id === parseInt(ejercicioId));
      if (matches.length > 0) {
        const maxP = Math.max(...matches.map(m => parseFloat(m.peso_kg) || 0));
        const matchMax = matches.find(m => parseFloat(m.peso_kg) === maxP) || matches[0];
        const reps = parseInt(matchMax.repeticiones) || 0;
        series.push({
          fecha: new Date(s.fecha_inicio || s.fecha || Date.now()).toLocaleDateString('es-ES'),
          peso_max: maxP,
          reps_en_peso_max: reps,
          volumen_total: matches.reduce((acc, m) => acc + ((parseFloat(m.peso_kg) || 0) * (parseInt(m.repeticiones) || 0)), 0),
          '1rm_estimado': maxP > 0 ? Math.round(maxP * (1 + reps / 30)) : 0
        });
      }
    });

    try {
      const data = await request(`/api/estadisticas/ejercicio/${ejercicioId}/progreso`);
      if (Array.isArray(data) && data.length > 0 && series.length === 0) {
        return data;
      }
    } catch (e) {}

    return series;
  },

  // --- EJERCICIOS ---
  getEjercicios: async (grupo = '', busqueda = '') => {
    const local = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const custom = local.filter(e => e.es_personalizado);
    const mergedMap = new Map();
    DEFAULT_EJERCICIOS.forEach(e => mergedMap.set(e.id, e));
    DEFAULT_EJERCICIOS.forEach(e => {
      // También mapear por nombre para sincronizar ejercicios existentes
      const match = Array.from(mergedMap.values()).find(x => x.nombre.trim().toLowerCase() === e.nombre.trim().toLowerCase());
      if (match) mergedMap.set(match.id, { ...match, ...e });
    });
    custom.forEach(e => mergedMap.set(e.id, e));
    const all = Array.from(mergedMap.values());
    setStored('ejercicios', all);

    return all.filter(ej => {
      const matchG = !grupo || grupo === 'Todos' || ej.grupo_muscular === grupo;
      const matchB = !busqueda || ej.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return matchG && matchB;
    });
  },

  createEjercicio: async (data) => {
    const newId = Date.now();
    const nuevo = { ...data, id: newId, es_personalizado: true };
    const current = getStored('ejercicios', DEFAULT_EJERCICIOS);
    setStored('ejercicios', [nuevo, ...current]);

    try {
      await request('/api/ejercicios', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {}

    return nuevo;
  },

  updateEjercicio: async (id, data) => {
    const current = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const updated = current.map(e => e.id === parseInt(id) ? { ...e, ...data } : e);
    setStored('ejercicios', updated);

    try {
      await request(`/api/ejercicios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {}

    return { ...data, id: parseInt(id) };
  },

  deleteEjercicio: async (id) => {
    const current = getStored('ejercicios', DEFAULT_EJERCICIOS);
    setStored('ejercicios', current.filter(e => e.id !== parseInt(id)));

    try {
      await request(`/api/ejercicios/${id}`, { method: 'DELETE' });
    } catch (e) {}

    return { success: true };
  },

  // --- RUTINAS ---
        getRutinas: async () => {
    const deletedIds = getStored('deleted_rutina_ids', []);
    let localRutinas = getStored('rutinas', null);

    if (!localRutinas || !Array.isArray(localRutinas) || localRutinas.length === 0) {
      localRutinas = DEFAULT_RUTINAS;
      setStored('rutinas', localRutinas);
      return localRutinas.filter(r => !deletedIds.includes(r.id));
    }

    // Mantener las personalizaciones del usuario como máxima prioridad
    const map = new Map();
    // 1. Base oficial
    DEFAULT_RUTINAS.forEach(r => {
      if (!deletedIds.includes(r.id)) {
        map.set(r.id, r);
      }
    });
    // 2. Rutinas guardadas y editadas por el usuario
    localRutinas.forEach(r => {
      if (!deletedIds.includes(r.id)) {
        map.set(r.id, r);
      }
    });

    const cleanList = Array.from(map.values()).filter(r => !deletedIds.includes(r.id));
    setStored('rutinas', cleanList);
    return cleanList;
  },

  resetRutinasToOfficial: async () => {
    try {
      localStorage.removeItem('mbtracker_rutinas');
      localStorage.removeItem('mbtracker_ejercicios');
      localStorage.removeItem('mbtracker_deleted_rutina_ids');
      localStorage.removeItem('mbtracker_has_custom_rutinas');
    } catch (e) {}
    setStored('rutinas', DEFAULT_RUTINAS);
    setStored('ejercicios', DEFAULT_EJERCICIOS);
    return DEFAULT_RUTINAS;
  },

  createRutina: async (data) => {
    const newId = Date.now();
    const deletedIds = getStored('deleted_rutina_ids', []);
    setStored('deleted_rutina_ids', deletedIds.filter(x => x !== newId));
    setStored('has_custom_rutinas', true);

    const catalog = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const current = getStored('rutinas', DEFAULT_RUTINAS);
    const nuevaLocal = {
      ...data,
      id: newId,
      fecha_creacion: new Date().toISOString(),
      dias: (data.dias || []).map((d, dIdx) => ({
        ...d,
        id: Date.now() + dIdx + 1,
        orden: dIdx + 1,
        ejercicios: (d.ejercicios || []).map((e, eIdx) => {
          const ejObj = e.ejercicio || catalog.find(x => x.id === e.ejercicio_id) || { id: e.ejercicio_id, nombre: 'Ejercicio', grupo_muscular: 'General' };
          return {
            ...e,
            id: Date.now() + dIdx * 100 + eIdx + 1,
            orden: eIdx + 1,
            ejercicio: ejObj
          };
        })
      }))
    };

    const updated = [nuevaLocal, ...current];
    setStored('rutinas', updated);

    try {
      await request('/api/rutinas', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {}

    return nuevaLocal;
  },

    updateRutina: async (id, data) => {
    const targetId = parseInt(id) || id;
    const deletedIds = getStored('deleted_rutina_ids', []);
    setStored('deleted_rutina_ids', deletedIds.filter(x => x !== targetId));
    setStored('has_custom_rutinas', true);

    const catalog = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const current = getStored('rutinas', DEFAULT_RUTINAS);
    let found = false;

    const formattedRutina = {
      ...data,
      id: targetId,
      dias: (data.dias || []).map((d, dIdx) => ({
        ...d,
        id: d.id || Date.now() + dIdx + 1,
        orden: dIdx + 1,
        ejercicios: (d.ejercicios || []).map((e, eIdx) => {
          const ejObj = e.ejercicio || catalog.find(x => x.id === e.ejercicio_id) || { id: e.ejercicio_id, nombre: e.nombre || 'Ejercicio', grupo_muscular: 'General' };
          return {
            ...e,
            id: e.id || Date.now() + dIdx * 100 + eIdx + 1,
            orden: eIdx + 1,
            ejercicio: ejObj
          };
        })
      }))
    };

    const updatedList = current.map(r => {
      if (r.id === targetId || String(r.id) === String(id) || (r.nombre && data.nombre && r.nombre.trim().toLowerCase() === data.nombre.trim().toLowerCase())) {
        found = true;
        return formattedRutina;
      }
      return r;
    });

    if (!found) {
      updatedList.unshift(formattedRutina);
    }

    setStored('rutinas', updatedList);

    try {
      await request(`/api/rutinas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {}

    return formattedRutina;
  },

  // --- SESIONES DE ENTRENAMIENTO (FINALIZAR & GUARDAR) ---
  getSesiones: async () => {
    let local = getStored('sesiones', []);
    if (!local || local.length === 0) {
      local = DEFAULT_SESIONES_HISTORIAL;
      setStored('sesiones', local);
    } else {
      // Asegurar que las 3 sesiones históricas existan en local
      const map = new Map();
      DEFAULT_SESIONES_HISTORIAL.forEach(s => map.set(s.id, s));
      local.forEach(s => map.set(s.id, s));
      local = Array.from(map.values()).sort((a, b) => new Date(b.fecha_inicio || b.fecha || 0) - new Date(a.fecha_inicio || a.fecha || 0));
      setStored('sesiones', local);
    }
    try {
      const data = await request('/api/sesiones');
      if (Array.isArray(data)) {
        const map = new Map();
        local.forEach(s => map.set(s.id, s));
        data.forEach(s => map.set(s.id, { ...map.get(s.id), ...s }));
        const merged = Array.from(map.values()).sort((a, b) => {
          const tA = new Date(a.fecha_inicio || a.fecha || 0).getTime();
          const tB = new Date(b.fecha_inicio || b.fecha || 0).getTime();
          return tB - tA;
        });
        setStored('sesiones', merged);
        return merged;
      }
      return local;
    } catch (e) {
      return local;
    }
  },

  createSesion: async (data) => {
    const catalog = getStored('ejercicios', DEFAULT_EJERCICIOS);
    const currentPRs = getStored('prs', []);
    const prMap = {};
    currentPRs.forEach(p => { prMap[p.ejercicio_id] = p.peso_maximo_kg; });

    const seriesProcessed = (data.series || []).map((s, idx) => {
      const peso = parseFloat(s.peso_kg) || 0;
      const prevMax = prMap[s.ejercicio_id] || 0;
      const isPR = peso > 0 && peso > prevMax;
      if (isPR) {
        prMap[s.ejercicio_id] = peso;
      }
      const ejInfo = catalog.find(e => e.id === s.ejercicio_id) || { nombre: s.nombre_ejercicio || 'Ejercicio', grupo_muscular: 'General' };
      return {
        id: Date.now() + idx,
        ejercicio_id: s.ejercicio_id,
        numero_serie: s.numero_serie || idx + 1,
        peso_kg: peso,
        repeticiones: parseInt(s.repeticiones) || 0,
        rpe: s.rpe || null,
        completada: true,
        es_pr: isPR,
        ejercicio: ejInfo
      };
    });

    const nuevaSesion = {
      id: Date.now(),
      nombre: data.nombre,
      tipo: data.tipo || 'gimnasio',
      deporte: data.deporte || null,
      distancia_km: data.distancia_km || 0,
      velocidad_kmh: data.velocidad_kmh || 0,
      ritmo_min_km: data.ritmo_min_km || null,
      desnivel_positivo_m: data.desnivel_positivo_m || 0,
      peso_mochila_kg: data.peso_mochila_kg || 0,
      frecuencia_cardiaca_media: data.frecuencia_cardiaca_media || null,
      calorias_quemadas: data.calorias_quemadas || 0,
      vueltas_laps: data.vueltas_laps || [],
      dia_rutina_id: data.dia_rutina_id || null,
      fecha_inicio: data.fecha_inicio || data.fecha || new Date().toISOString(),
      fecha_fin: new Date().toISOString(),
      duracion_segundos: data.duracion_segundos || 0,
      duracion_minutos: data.duracion_minutos || Math.max(Math.round((data.duracion_segundos || 0) / 60), 1),
      animo: data.animo || null,
      energia: data.energia || null,
      molestia: data.molestia || null,
      checkin_notas: data.checkin_notas || '',
      notas: data.notas || '',
      completado: true,
      series: seriesProcessed
    };

    const currentSesiones = getStored('sesiones', []);
    const updatedSesiones = [nuevaSesion, ...currentSesiones];
    setStored('sesiones', updatedSesiones);

    // Actualizar PRs de forma segura
    try {
      const updatedPRs = [...currentPRs];
      seriesProcessed.filter(s => s.es_pr).forEach(s => {
        const idx = updatedPRs.findIndex(p => p.ejercicio_id === s.ejercicio_id);
        const ejNom = s.ejercicio?.nombre || s.nombre_ejercicio || 'Ejercicio';
        const ejGrp = s.ejercicio?.grupo_muscular || 'General';
        const prObj = {
          ejercicio_id: s.ejercicio_id,
          nombre_ejercicio: ejNom,
          grupo_muscular: ejGrp,
          peso_maximo_kg: s.peso_kg,
          repeticiones: s.repeticiones,
          fecha: new Date().toISOString(),
          sesion_id: nuevaSesion.id
        };
        if (idx >= 0) {
          updatedPRs[idx] = prObj;
        } else {
          updatedPRs.push(prObj);
        }
      });
      setStored('prs', updatedPRs);
    } catch (prErr) {
      console.warn("PR update non-blocking error", prErr);
    }

    try {
      await request('/api/sesiones', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {}

    return nuevaSesion;
  },

  deleteSesion: async (id) => {
    const current = getStored('sesiones', []);
    setStored('sesiones', current.filter(s => s.id !== parseInt(id)));
    try {
      await request(`/api/sesiones/${id}`, { method: 'DELETE' });
    } catch (e) {}
    return { success: true };
  },

  getUltimoRegistroEjercicio: async (ejercicioId) => {
    const sesiones = getStored('sesiones', []);
    for (const s of sesiones) {
      const matches = (s.series || []).filter(item => item.ejercicio_id === parseInt(ejercicioId));
      if (matches.length > 0) return matches;
    }

    try {
      const res = await request(`/api/sesiones/ultimo-registro/${ejercicioId}`);
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (e) {}

    return [];
  },

  // --- REINICIAR Y PURGAR ---
  resetAllUserData: async () => {
    try {
      localStorage.clear();
      setStored('rutinas', DEFAULT_RUTINAS);
      setStored('ejercicios', DEFAULT_EJERCICIOS);
      setStored('sesiones', []);
      setStored('prs', []);
      return true;
    } catch (e) {
      return false;
    }
  }
};
