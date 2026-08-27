// Base de datos de Demostraciones Visuales con técnica y activación biomecánica para todos los ejercicios

export const EXERCISE_VISUALS = {
  // --- PECHO ---
  "Press de Banca Plano con Barra": {
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
  "Press de Banca Plano con Mancuernas": {
    animacion_tipo: "bench_press",
    musculo_principal: "Pectoral Mayor (Mayor rango de movimiento)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps"],
    tips: [
      "Baja las mancuernas sintiendo el estiramiento en el pecho.",
      "Empuja hacia arriba en trayectoria ligeramente convergente sin chocar las pesas."
    ],
    respiracion: "Inhala al descender; exhala al empujar arriba."
  },
  "Press Inclinado con Mancuernas": {
    animacion_tipo: "bench_press",
    musculo_principal: "Pectoral Superior (Clavicular)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps"],
    tips: [
      "Banco inclinado a 30° - 45°.",
      "Baja las mancuernas con los codos a unos 45° del torso para proteger hombros.",
      "Presiona hacia arriba con control continuo."
    ],
    respiracion: "Inhala al bajar; exhala al empujar arriba."
  },
  "Aperturas en Polea (Cruces)": {
    animacion_tipo: "bench_press",
    musculo_principal: "Pectoral Mayor (Aislamiento)",
    musculos_secundarios: ["Deltoides Anterior"],
    tips: [
      "Ligera flexión fija en los codos.",
      "Abre sintiendo el estiramiento del pecho y aprieta 1 segundo al cruzar."
    ],
    respiracion: "Inhala al abrir; exhala al juntar las manos."
  },
  "Flexiones de pecho (Push-ups)": {
    animacion_tipo: "bench_press",
    musculo_principal: "Pectoral y Tríceps",
    musculos_secundarios: ["Core", "Deltoides Anterior"],
    tips: [
      "Cuerpo alineado como una tabla recta desde la cabeza hasta los talones.",
      "Baja hasta que el pecho quede a 2 cm del suelo con codos a 45°."
    ],
    respiracion: "Inhala al bajar; exhala al empujar el suelo."
  },
  "Fondos en Paralelas (Dips)": {
    animacion_tipo: "tricep_pushdown",
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
    animacion_tipo: "lat_pulldown",
    musculo_principal: "Dorsal Ancho (Amplitud de Espalda)",
    musculos_secundarios: ["Bíceps", "Redondo Mayor", "Trapecio"],
    tips: [
      "Pecho erguido mirando ligeramente hacia arriba.",
      "Tira con los codos hacia abajo y adentro hasta la altura de la clavícula.",
      "Controla la subida sintiendo el estiramiento dorsal completo."
    ],
    respiracion: "Exhala al bajar la barra al pecho; inhala al subir."
  },
  "Dominadas (Pull-ups)": {
    animacion_tipo: "lat_pulldown",
    musculo_principal: "Dorsales y Espalda Alta",
    musculos_secundarios: ["Bíceps", "Antebrazos", "Core"],
    tips: [
      "Agarre pronado ancho. Sube hasta pasar la barbilla por encima de la barra.",
      "Baja de forma controlada sin balanceos bruscos."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Remo con Barra": {
    animacion_tipo: "barbell_row",
    musculo_principal: "Dorsal Ancho y Espalda Media (Grosor)",
    musculos_secundarios: ["Bíceps", "Trapecio", "Erectores Espinales"],
    tips: [
      "Espalda completamente recta e inclinada a unos 45°.",
      "Tracciona la barra hacia el ombligo apretando las escápulas atrás.",
      "No redondees la zona lumbar."
    ],
    respiracion: "Exhala al tirar hacia el torso; inhala al bajar controladamente."
  },
  "Remo Unilateral con Mancuerna (Serrucho)": {
    animacion_tipo: "barbell_row",
    musculo_principal: "Dorsal Ancho (Unilateral)",
    musculos_secundarios: ["Bíceps", "Deltoides Posterior"],
    tips: [
      "Apóyate en el banco con la espalda paralela al piso.",
      "Lleva la mancuerna hacia la cadera en trayectoria curva con el codo pegado al cuerpo."
    ],
    respiracion: "Exhala al subir; inhala al bajar estirando el dorsal."
  },
  "Remo en Polea Baja (Gironda)": {
    animacion_tipo: "barbell_row",
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
    animacion_tipo: "squat",
    musculo_principal: "Cuádriceps, Glúteos e Isquios",
    musculos_secundarios: ["Core", "Erectores Espinales"],
    tips: [
      "Pies al ancho de hombros con puntas ligeramente abiertas.",
      "Desciende quebrando cadera y rodillas al mismo tiempo hasta romper el paralelo.",
      "Empuja el suelo con toda la planta del pie."
    ],
    respiracion: "Inhala y compacta el abdomen al bajar; exhala al subir."
  },
  "Prensa de Piernas 45°": {
    animacion_tipo: "squat",
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
    animacion_tipo: "hip_hinge",
    musculo_principal: "Isquiosurales y Glúteos",
    musculos_secundarios: ["Erectores Espinales"],
    tips: [
      "Empuja las caderas hacia atrás con las rodillas semi-flexionadas y fijas.",
      "Mantén la barra pegada a los muslos y la columna neutra."
    ],
    respiracion: "Inhala al bajar; exhala al subir apretando glúteos."
  },
  "Hip Thrust con Barra": {
    animacion_tipo: "hip_hinge",
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
    animacion_tipo: "lateral_raise",
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
    animacion_tipo: "bicep_curl",
    musculo_principal: "Braquial y Braquiorradial (Grosor del Brazo)",
    musculos_secundarios: ["Bíceps"],
    tips: [
      "Palmas mirándose entre sí durante todo el recorrido.",
      "Controla el descenso completo."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Extensiones de Tríceps en Polea (Cuerda)": {
    animacion_tipo: "tricep_pushdown",
    musculo_principal: "Tríceps Braquial",
    musculos_secundarios: ["Antebrazos"],
    tips: [
      "Codos fijos a las costillas.",
      "Empuja la cuerda hacia abajo y ábrela al final para máxima contracción."
    ],
    respiracion: "Exhala al extender los brazos; inhala al flexionar."
  },
  "Press Francés con Barra Z": {
    animacion_tipo: "tricep_pushdown",
    musculo_principal: "Tríceps (Cabeza Larga)",
    musculos_secundarios: ["Antebrazos"],
    tips: [
      "Acostado en banco, baja la barra hacia la frente flexionando solo los codos.",
      "Extiende los brazos manteniendo los codos apuntando al techo."
    ],
    respiracion: "Inhala al bajar; exhala al extender."
  },

  // --- 🔥 CALENTAMIENTO Y MOVILIDAD ---
  "Dislocaciones de Hombro con Banda / Pica": {
    animacion_tipo: "lateral_raise",
    musculo_principal: "Movilidad de Hombros y Pectoral",
    musculos_secundarios: ["Manguito Rotador", "Trapecio"],
    tips: [
      "Toma una banda elástica con agarre amplio.",
      "Pasa los brazos rectos por encima de la cabeza hacia atrás y regresa de forma fluida."
    ],
    respiracion: "Inhala al subir los brazos; exhala al llevarlos atrás."
  },
  "Gato-Camello (Cat-Cow) Columna": {
    animacion_tipo: "core_crunch",
    musculo_principal: "Movilidad de Columna y Lumbar",
    musculos_secundarios: ["Core", "Erectores Espinales"],
    tips: [
      "En cuatro apoyos, arquea la espalda hacia arriba metiendo la cabeza.",
      "Luego arquea hacia abajo mirando al frente abriendo el pecho."
    ],
    respiracion: "Exhala al arquear hacia arriba; inhala al descender el abdomen."
  },
  "Rotación Torácica en Cuadrupedia": {
    animacion_tipo: "barbell_row",
    musculo_principal: "Movilidad Torácica y Dorsal",
    musculos_secundarios: ["Deltoides Posterior", "Romboides"],
    tips: [
      "Mano detrás de la cabeza en cuatro apoyos.",
      "Gira el codo hacia el techo abriendo el torso al máximo."
    ],
    respiracion: "Exhala al rotar hacia arriba; inhala al bajar el codo."
  },
  "Apertura de Cadera en 90/90": {
    animacion_tipo: "squat",
    musculo_principal: "Cápsula Articular de la Cadera",
    musculos_secundarios: ["Glúteo Medio", "Aductores"],
    tips: [
      "Sentada en el suelo con ambas piernas formando ángulos de 90°.",
      "Gira las rodillas de un lado a otro manteniendo el torso erguido."
    ],
    respiracion: "Respira hondo y relajada en cada cambio."
  },

  // --- 🦵 REHABILITACIÓN Y FORTALECIMIENTO DE RODILLA ---
  "Sentadilla Isométrica en Pared (Wall Sit)": {
    animacion_tipo: "squat",
    musculo_principal: "Cuádriceps y Tendón Rotuliano",
    musculos_secundarios: ["Glúteos", "Core"],
    tips: [
      "Espalda apoyada en la pared y muslos paralelos al suelo a 90°.",
      "Mantén la posición sin balancearte activando los cuádriceps."
    ],
    respiracion: "Respiraciones diafragmáticas lentas y continuas."
  },
  "Extensiones Terminales de Rodilla con Banda (TKE)": {
    animacion_tipo: "squat",
    musculo_principal: "Vasto Medial del Cuádriceps (Estabilidad de Rodilla)",
    musculos_secundarios: ["Isquiosurales"],
    tips: [
      "Banda elástica detrás de la corva de la rodilla anclada al frente.",
      "Extiende la rodilla hacia atrás apretando el cuádriceps 2 segundos."
    ],
    respiracion: "Exhala al extender la pierna; inhala al flexionar."
  },
  "Puente de Glúteo Unipodal": {
    animacion_tipo: "hip_hinge",
    musculo_principal: "Glúteo Mayor y Cadena Posterior",
    musculos_secundarios: ["Isquiotibiales", "Core"],
    tips: [
      "Una pierna apoyada y la otra elevada.",
      "Eleva la pelvis hasta alinear la rodilla y el torso apretando el glúteo."
    ],
    respiracion: "Exhala al elevar la pelvis; inhala al descender."
  },
  "Clamshells / Almejas con Banda": {
    animacion_tipo: "hip_hinge",
    musculo_principal: "Glúteo Medio (Prevención de Valgo de Rodilla)",
    musculos_secundarios: ["Rotadores de Cadera"],
    tips: [
      "Recostada de lado con rodillas flexionadas a 90°.",
      "Abre la rodilla superior manteniendo los talones juntos sin girar la pelvis."
    ],
    respiracion: "Exhala al abrir la rodilla; inhala al cerrar."
  },
  "Monster Walk / Pasos con Banda": {
    animacion_tipo: "squat",
    musculo_principal: "Glúteo Medio y Abductores",
    musculos_secundarios: ["Cuádriceps", "Tobillos"],
    tips: [
      "Banda en los tobillos o rodillas en posición de media sentadilla.",
      "Da pasos laterales manteniendo la tensión constante en la banda."
    ],
    respiracion: "Respiración constante y controlada."
  },

  // --- 🦶 REHABILITACIÓN DE TOBILLO Y PIE ---
  "Dorsiflexión de Tobillo en Pared": {
    animacion_tipo: "squat",
    musculo_principal: "Tendón de Aquiles y Movilidad de Tobillo",
    musculos_secundarios: ["Sóleo", "Gemelos"],
    tips: [
      "Pie a 8-10 cm de la pared.",
      "Lleva la rodilla hacia la pared sin despegar el talón del piso."
    ],
    respiracion: "Exhala al adelantar la rodilla; inhala al regresar."
  },
  "Elevación de Gemelos Excéntrica a 1 Pierna": {
    animacion_tipo: "squat",
    musculo_principal: "Gemelos y Tendón de Aquiles",
    musculos_secundarios: ["Planta del pie"],
    tips: [
      "Sube con ambos pies sobre un escalón.",
      "Quita un pie y baja con una sola pierna muy lentamente en 4 segundos."
    ],
    respiracion: "Exhala al subir; inhala durante los 4 segundos de bajada."
  },
  "Caminata en Talones y Puntas": {
    animacion_tipo: "squat",
    musculo_principal: "Tibial Anterior y Estabilidad de Tobillo",
    musculos_secundarios: ["Gemelos", "Fascia Plantar"],
    tips: [
      "Camina 20 pasos sobre los talones levantando las puntas de los pies.",
      "Luego camina 20 pasos sobre las puntas de los pies con talones altos."
    ],
    respiracion: "Respiración fluida."
  },

  // --- 🧘 ESTIRAMIENTOS Y VUELTA A LA CALMA ---
  "Estiramiento de Isquiosurales en Suelo": {
    animacion_tipo: "hip_hinge",
    musculo_principal: "Isquiosurales y Cadena Posterior",
    musculos_secundarios: ["Lumbar", "Gemelos"],
    tips: [
      "Pierna extendida al frente con espalda recta.",
      "Inclínate desde la cadera hacia la punta del pie sin curvar la columna."
    ],
    respiracion: "Inhala profundo; exhala relajando y profundizando el estiramiento."
  },
  "Estiramiento de Cuádriceps y Psoas": {
    animacion_tipo: "squat",
    musculo_principal: "Cuádriceps y Flexores de Cadera",
    musculos_secundarios: ["Abdomen"],
    tips: [
      "Toma el empeine por detrás llevando el talón al glúteo.",
      "Mantén las rodillas juntas y empuja ligeramente la pelvis hacia adelante."
    ],
    respiracion: "Sostén 30 segundos respirando con calma."
  },
  "Posición del Niño (Child's Pose)": {
    animacion_tipo: "core_crunch",
    musculo_principal: "Espalda Completa, Dorsales y Cadera",
    musculos_secundarios: ["Hombros", "Columna"],
    tips: [
      "De rodillas, siéntate sobre los talones y estira los brazos al frente en el suelo.",
      "Deja caer el pecho hacia el piso relajando cuello y hombros."
    ],
    respiracion: "Respiraciones profundas y lentas sintiendo la apertura dorsal."
  },
  "Cobra / Extensión Lumbar Suave": {
    animacion_tipo: "core_crunch",
    musculo_principal: "Pared Abdominal y Descompresión Lumbar",
    musculos_secundarios: ["Pectorales", "Flexores"],
    tips: [
      "Tumbada boca abajo, apoya las palmas al lado de los hombros.",
      "Extiende los brazos suavemente levantando el pecho sin despegar la pelvis."
    ],
    respiracion: "Inhala al elevar el pecho; exhala relajando la tensión."
  },
  "Estiramiento Pectoral en Pared": {
    animacion_tipo: "bench_press",
    musculo_principal: "Pectoral Mayor y Menor",
    musculos_secundarios: ["Deltoides Anterior", "Bíceps"],
    tips: [
      "Apoya el antebrazo en una pared o marco de puerta a 90°.",
      "Gira el torso en dirección contraria sintiendo la apertura en el pecho."
    ],
    respiracion: "Mantén 20-30 segundos por lado de forma relajada."
  }
};

// Obtener datos visuales por nombre o grupo
export function getExerciseVisual(nombre, grupoMuscular = "General") {
  if (!nombre) return EXERCISE_VISUALS["Press de Banca Plano con Barra"];

  // Coincidencia directa
  if (EXERCISE_VISUALS[nombre]) {
    return EXERCISE_VISUALS[nombre];
  }

  // Coincidencia parcial
  const nombreLow = nombre.toLowerCase();
  const matchedKey = Object.keys(EXERCISE_VISUALS).find(k => 
    nombreLow.includes(k.toLowerCase()) || k.toLowerCase().includes(nombreLow)
  );
  if (matchedKey) {
    return EXERCISE_VISUALS[matchedKey];
  }

  // Detección inteligente por palabras clave
  if (nombreLow.includes('jalón') || nombreLow.includes('pulldown') || nombreLow.includes('dominada')) return EXERCISE_VISUALS["Jalón al Pecho en Polea"];
  if (nombreLow.includes('serrucho') || nombreLow.includes('remo')) return EXERCISE_VISUALS["Remo con Barra"];
  if (nombreLow.includes('militar') || nombreLow.includes('overhead')) return EXERCISE_VISUALS["Press Militar con Barra / Mancuernas"];
  if (nombreLow.includes('lateral') || nombreLow.includes('pájaro') || nombreLow.includes('face pull')) return EXERCISE_VISUALS["Elevaciones Laterales"];
  if (nombreLow.includes('bíceps') || nombreLow.includes('curl')) return EXERCISE_VISUALS["Curl de Bíceps con Barra Z"];
  if (nombreLow.includes('tríceps') || nombreLow.includes('francés') || nombreLow.includes('dips')) return EXERCISE_VISUALS["Extensiones de Tríceps en Polea (Cuerda)"];
  if (nombreLow.includes('sentadilla') || nombreLow.includes('squat') || nombreLow.includes('prensa')) return EXERCISE_VISUALS["Sentadilla con Barra (Back Squat)"];
  if (nombreLow.includes('rumano') || nombreLow.includes('peso muerto') || nombreLow.includes('thrust')) return EXERCISE_VISUALS["Peso Muerto Rumano (RDL)"];
  if (nombreLow.includes('rodilla') || nombreLow.includes('wall sit') || nombreLow.includes('almeja')) return EXERCISE_VISUALS["Sentadilla Isométrica en Pared (Wall Sit)"];
  if (nombreLow.includes('tobillo') || nombreLow.includes('dorsiflexi')) return EXERCISE_VISUALS["Dorsiflexión de Tobillo en Pared"];
  if (nombreLow.includes('estiramiento') || nombreLow.includes('niño') || nombreLow.includes('cobra')) return EXERCISE_VISUALS["Posición del Niño (Child's Pose)"];
  if (nombreLow.includes('gato') || nombreLow.includes('movilidad') || nombreLow.includes('dislocaci')) return EXERCISE_VISUALS["Dislocaciones de Hombro con Banda / Pica"];

  return EXERCISE_VISUALS["Press de Banca Plano con Barra"];
}
