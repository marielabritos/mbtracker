// Base de datos de Demostraciones Visuales con GIFs animados reales y técnica de ejercicios

export const EXERCISE_VISUALS = {
  // --- PECHO ---
  "Press de Banca Plano con Barra": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif",
    animacion_tipo: "bench_press",
    musculo_principal: "Pectoral Mayor (Medio e Inferior)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps Braquial"],
    tips: [
      "Retrae las escápulas y mantén los pies bien apoyados en el suelo.",
      "Baja la barra de forma controlada hasta rozar la parte media del pecho.",
      "Empuja con fuerza vertical sin bloquear bruscamente los codos arriba."
    ],
    respiracion: "Inhala al bajar la barra; exhala al empujar hacia arriba."
  },
  "Press Inclinado con Mancuernas": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif",
    animacion_tipo: "incline_press",
    musculo_principal: "Pectoral Superior (Clavicular)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps"],
    tips: [
      "Banco inclinado a 30° - 45°.",
      "Baja las mancuernas con los codos a unos 45° del torso para proteger hombros.",
      "Presiona hacia arriba en una ligera trayectoria convergente."
    ],
    respiracion: "Inhala al bajar; exhala al empujar arriba."
  },
  "Aperturas en Polea (Cruces)": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    animacion_tipo: "cable_fly",
    musculo_principal: "Pectoral Mayor (Aislamiento)",
    musculos_secundarios: ["Deltoides Anterior"],
    tips: [
      "Ligera flexión fija en los codos.",
      "Abre sintiendo el estiramiento del pecho y aprieta 1 segundo al cruzar."
    ],
    respiracion: "Inhala al abrir; exhala al juntar las manos."
  },
  "Fondos en Paralelas (Dips)": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Dips.gif",
    animacion_tipo: "dips",
    musculo_principal: "Pectoral Inferior y Tríceps",
    musculos_secundarios: ["Deltoides Anterior", "Core"],
    tips: [
      "Inclina el torso ligeramente hacia adelante.",
      "Baja hasta que los codos formen un ángulo de 90°."
    ],
    respiracion: "Inhala al bajar; exhala al subir."
  },

  // --- ESPALDA ---
  "Jalón al Pecho en Polea": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif",
    animacion_tipo: "lat_pulldown",
    musculo_principal: "Dorsal Ancho (Amplitud de Espalda)",
    musculos_secundarios: ["Bíceps", "Redondo Mayor", "Trapecio"],
    tips: [
      "Pecho erguido mirando ligeramente hacia arriba.",
      "Tira con los codos hacia abajo y adentro hasta la altura de la clavícula/pecho alto.",
      "Controla la subida sintiendo el estiramiento dorsal completo."
    ],
    respiracion: "Exhala al bajar la barra al pecho; inhala al subir."
  },
  "Remo con Barra": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
    animacion_tipo: "barbell_row",
    musculo_principal: "Dorsal Ancho y Espalda Media (Grosor)",
    musculos_secundarios: ["Bíceps", "Trapecio", "Erectores Espinales"],
    tips: [
      "Espalda completamente recta e inclinada a unos 45°.",
      "Tracciona la barra hacia el ombligo apretando las escápulas atrás.",
      "No utilices impulso con las piernas ni redondees la zona lumbar."
    ],
    respiracion: "Exhala al tirar hacia el torso; inhala al bajar controladamente."
  },
  "Remo Unilateral con Mancuerna (Serrucho)": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif",
    animacion_tipo: "dumbbell_row",
    musculo_principal: "Dorsal Ancho (Unilateral)",
    musculos_secundarios: ["Bíceps", "Deltoides Posterior"],
    tips: [
      "Apóyate en el banco con la espalda paralela al piso.",
      "Lleva la mancuerna hacia la cadera en trayectoria curva con el codo pegado al cuerpo."
    ],
    respiracion: "Exhala al subir; inhala al bajar estirando el dorsal."
  },
  "Remo en Polea Baja (Gironda)": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    animacion_tipo: "cable_row",
    musculo_principal: "Espalda Media y Romboides",
    musculos_secundarios: ["Bíceps", "Trapecio"],
    tips: [
      "Mantén la espalda recta y tira hacia el abdomen bajo.",
      "Pausa 1 segundo atrás para máxima contracción escapular."
    ],
    respiracion: "Exhala al traccionar; inhala al regresar."
  },

  // --- PIERNAS & GLÚTEOS ---
  "Sentadilla con Barra (Back Squat)": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif",
    animacion_tipo: "squat",
    musculo_principal: "Cuádriceps, Glúteos e Isquios",
    musculos_secundarios: ["Core", "Erectores Espinales"],
    tips: [
      "Pies al ancho de hombros con puntas ligeramente abiertas.",
      "Desciende quebrando cadera y rodillas al mismo tiempo hasta romper el paralelo.",
      "Mantén el pecho alto y empuja el suelo con toda la planta del pie."
    ],
    respiracion: "Inhala y compacta el abdomen al bajar; exhala al subir."
  },
  "Prensa de Piernas 45°": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif",
    animacion_tipo: "leg_press",
    musculo_principal: "Cuádriceps y Glúteos",
    musculos_secundarios: ["Isquiosurales"],
    tips: [
      "Pies en la plataforma a la anchura de caderas.",
      "Baja controlando el peso hasta 90° sin despegar la espalda baja.",
      "Nunca bloquees las rodillas bruscamente en la extensión superior."
    ],
    respiracion: "Inhala al bajar el carro; exhala al empujar."
  },
  "Peso Muerto Rumano (RDL)": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif",
    animacion_tipo: "rdl",
    musculo_principal: "Isquiosurales y Glúteos",
    musculos_secundarios: ["Erectores Espinales"],
    tips: [
      "Empuja las caderas hacia atrás con las rodillas semi-flexionadas y fijas.",
      "Mantén la barra pegada a los muslos y la columna neutra."
    ],
    respiracion: "Inhala al bajar; exhala al subir apretando glúteos."
  },
  "Hip Thrust con Barra": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hip-Thrust.gif",
    animacion_tipo: "hip_thrust",
    musculo_principal: "Glúteo Mayor",
    musculos_secundarios: ["Isquiosurales", "Cuádriceps"],
    tips: [
      "Escápulas apoyadas en el borde del banco.",
      "Empuja desde los talones hasta alinear torso y muslos a 90° apretando fuerte los glúteos arriba."
    ],
    respiracion: "Inhala abajo; exhala al bloquear arriba."
  },

  // --- HOMBROS ---
  "Press Militar con Barra / Mancuernas": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Press.gif",
    animacion_tipo: "overhead_press",
    musculo_principal: "Deltoides Anterior y Medio",
    musculos_secundarios: ["Tríceps", "Trapecio", "Core"],
    tips: [
      "Glúteos y abdomen activos para no arquear la espalda.",
      "Empuja el peso verticalmente sobre la cabeza de manera fluida."
    ],
    respiracion: "Inhala abajo; exhala al empujar sobre la cabeza."
  },
  "Elevaciones Laterales": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    animacion_tipo: "lateral_raise",
    musculo_principal: "Deltoides Lateral (Hombros Redondos)",
    musculos_secundarios: ["Trapecio Superior"],
    tips: [
      "Eleva los brazos guiando con los codos ligeramente por delante del cuerpo.",
      "Sube hasta la altura de los hombros sin impulsos del torso."
    ],
    respiracion: "Exhala al subir; inhala al bajar en 2 segundos."
  },
  "Pájaros / Face Pull en Polea": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif",
    animacion_tipo: "face_pull",
    musculo_principal: "Deltoides Posterior y Manguito Rotador",
    musculos_secundarios: ["Romboides", "Trapecio"],
    tips: [
      "Polea alta con cuerda. Tira hacia la frente separando los extremos de la cuerda.",
      "Abre los codos y rota los hombros hacia afuera."
    ],
    respiracion: "Exhala al tirar hacia la cara; inhala al regresar."
  },

  // --- BRAZOS ---
  "Curl de Bíceps con Barra Z": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/EZ-Barbell-Curl.gif",
    animacion_tipo: "bicep_curl",
    musculo_principal: "Bíceps Braquial",
    musculos_secundarios: ["Braquial Anterior", "Antebrazos"],
    tips: [
      "Codos pegados a los costados y fijos.",
      "Sube apretando el bíceps y baja lentamente sin balanceos."
    ],
    respiracion: "Exhala al subir la barra; inhala al descender."
  },
  "Curl Martillo con Mancuernas": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif",
    animacion_tipo: "hammer_curl",
    musculo_principal: "Braquial y Braquiorradial (Grosor del Brazo)",
    musculos_secundarios: ["Bíceps"],
    tips: [
      "Palmas mirándose entre sí durante todo el recorrido.",
      "Controla el descenso completo."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Extensiones de Tríceps en Polea (Cuerda)": {
    gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Rope-Pushdown.gif",
    animacion_tipo: "tricep_pushdown",
    musculo_principal: "Tríceps Braquial",
    musculos_secundarios: ["Antebrazos"],
    tips: [
      "Codos fijos a las costillas.",
      "Empuja la cuerda hacia abajo y ábrela al final para máxima contracción."
    ],
    respiracion: "Exhala al extender los brazos; inhala al flexionar."
  }
};

// Obtener datos visuales por nombre o grupo
export function getExerciseVisual(nombre, grupoMuscular = "General") {
  // Coincidencia exacta
  if (EXERCISE_VISUALS[nombre]) {
    return EXERCISE_VISUALS[nombre];
  }

  // Coincidencia parcial (por si el usuario renombra a "Remo con Barra supino", etc.)
  const matchedKey = Object.keys(EXERCISE_VISUALS).find(k => 
    nombre.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(nombre.toLowerCase())
  );
  if (matchedKey) {
    return EXERCISE_VISUALS[matchedKey];
  }

  // Fallbacks animados por grupo muscular
  const grupoDefaults = {
    Pecho: {
      gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif",
      musculo_principal: "Pectoral Mayor y Menor",
      musculos_secundarios: ["Tríceps", "Deltoides"],
      tips: ["Mantén el pecho erguido y las escápulas retraídas.", "Controla la fase de bajada y empuja con potencia."],
      respiracion: "Inhala al bajar el peso; exhala al empujar."
    },
    Espalda: {
      gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
      musculo_principal: "Dorsales y Espalda Media",
      musculos_secundarios: ["Bíceps", "Trapecio"],
      tips: ["Tracciona con los codos y junta las escápulas atrás.", "Mantén la columna firme sin tirones lumbares."],
      respiracion: "Exhala al traccionar; inhala al extender."
    },
    Piernas: {
      gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif",
      musculo_principal: "Cuádriceps, Isquios y Glúteos",
      musculos_secundarios: ["Core", "Gemelos"],
      tips: ["Pies bien plantados. Controla la bajada y empuja desde los talones."],
      respiracion: "Inhala al descender; exhala al subir."
    },
    Hombros: {
      gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
      musculo_principal: "Deltoides (Hombros)",
      musculos_secundarios: ["Trapecio", "Tríceps"],
      tips: ["Trabaja con trayectoria fluida sin balancear el torso."],
      respiracion: "Exhala en el esfuerzo; inhala al regresar."
    },
    Brazos: {
      gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/EZ-Barbell-Curl.gif",
      musculo_principal: "Bíceps y Tríceps",
      musculos_secundarios: ["Antebrazos"],
      tips: ["Mantén los codos pegados al cuerpo y aísla la contracción."],
      respiracion: "Exhala al contraer; inhala al extender."
    },
    Core: {
      gif: "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crunch.gif",
      musculo_principal: "Abdomen y Core",
      musculos_secundarios: ["Oblicuos"],
      tips: ["Contrae el abdomen en todo el rango sin forzar el cuello."],
      respiracion: "Exhala al flexionar el torso; inhala al extender."
    }
  };

  return grupoDefaults[grupoMuscular] || grupoDefaults["Pecho"];
}
