// Base de datos de Demostraciones Visuales, Técnica y Animaciones de Ejercicios

export const EXERCISE_VISUALS = {
  // --- PECHO ---
  "Press de Banca Plano con Barra": {
    gif: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "bench_press",
    musculo_principal: "Pectoral Mayor (Medio e Inferior)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps Braquial"],
    tips: [
      "Retrae las escápulas y mantén un arco lumbar natural con los pies firmes en el suelo.",
      "Baja la barra de forma controlada (2-3s) hasta la altura de los pezones / esternón medio.",
      "Empuja con fuerza vertical sin despegar los glúteos del banco ni bloquear bruscamente los codos."
    ],
    respiracion: "Inhala profundamente al bajar la barra; exhala con fuerza al empujar hacia arriba."
  },
  "Press Inclinado con Mancuernas": {
    gif: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "incline_press",
    musculo_principal: "Pectoral Superior (Haz Clavicular)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps"],
    tips: [
      "Ajusta el banco a unos 30° - 45° de inclinación.",
      "Baja las mancuernas con los codos a unos 45° del torso para proteger los hombros.",
      "Sube en una trayectoria ligeramente convergente sin chocar las mancuernas."
    ],
    respiracion: "Inhala al bajar; exhala al presionar arriba."
  },
  "Aperturas en Polea (Cruces)": {
    gif: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "cable_fly",
    musculo_principal: "Pectoral Mayor (Aislamiento y Estiramiento)",
    musculos_secundarios: ["Deltoides Anterior"],
    tips: [
      "Mantén una ligera flexión fija en los codos durante todo el movimiento.",
      "Siente el estiramiento profundo del pecho al abrir y aprieta con fuerza 1 segundo al cruzar."
    ],
    respiracion: "Inhala al abrir; exhala al apretar en el centro."
  },
  "Fondos en Paralelas (Dips)": {
    gif: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "dips",
    musculo_principal: "Pectoral Inferior y Tríceps",
    musculos_secundarios: ["Deltoides Anterior", "Core"],
    tips: [
      "Inclina el torso ligeramente hacia adelante para mayor activación pectoral.",
      "Baja hasta que los codos formen un ángulo de 90° sin encoger los hombros."
    ],
    respiracion: "Inhala al descender; exhala al extender los brazos."
  },

  // --- ESPALDA ---
  "Jalón al Pecho en Polea": {
    gif: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "lat_pulldown",
    musculo_principal: "Dorsal Ancho (Amplitud)",
    musculos_secundarios: ["Bíceps", "Redondo Mayor", "Trapecio"],
    tips: [
      "Agarre ligeramente más ancho que los hombros. Pecho erguido mirando levemente arriba.",
      "Tira con los codos hacia abajo y hacia adentro, llevando la barra a la parte superior del pecho.",
      "Evita balancear excesivamente el torso hacia atrás."
    ],
    respiracion: "Exhala al bajar la barra al pecho; inhala al extender los brazos controladamente."
  },
  "Remo con Barra": {
    gif: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "barbell_row",
    musculo_principal: "Dorsal Ancho, Trapecio y Espalda Media (Grosor)",
    musculos_secundarios: ["Bíceps", "Erectores Espinales", "Deltoides Posterior"],
    tips: [
      "Flexiona caderas y rodillas manteniendo la espalda completamente recta a unos 45°.",
      "Tira de la barra hacia la zona del ombligo / cadera apretando las escápulas.",
      "Controla la fase de bajada sin redondear la columna lumbar."
    ],
    respiracion: "Exhala al tirar hacia el torso; inhala al bajar la barra."
  },
  "Remo Unilateral con Mancuerna (Serrucho)": {
    gif: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "dumbbell_row",
    musculo_principal: "Dorsal Ancho y Romboides",
    musculos_secundarios: ["Bíceps", "Deltoides Posterior"],
    tips: [
      "Apoya una rodilla y mano en el banco con la columna neutra y paralela al suelo.",
      "Lleva la mancuerna hacia tu cadera dibujando una curva con el codo pegado al torso."
    ],
    respiracion: "Exhala al subir; inhala al bajar estirando el dorsal."
  },
  "Remo en Polea Baja (Gironda)": {
    gif: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "cable_row",
    musculo_principal: "Espalda Media y Dorsal",
    musculos_secundarios: ["Bíceps", "Trapecio"],
    tips: [
      "Mantén el pecho erguido y las rodillas semi-flexionadas.",
      "Tracciona hacia la parte baja del abdomen apretando los dorsales 1 segundo."
    ],
    respiracion: "Exhala al traccionar; inhala al regresar a la posición inicial."
  },

  // --- PIERNAS & GLÚTEOS ---
  "Sentadilla con Barra (Back Squat)": {
    gif: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "squat",
    musculo_principal: "Cuádriceps, Glúteos e Isquiosurales",
    musculos_secundarios: ["Core", "Erectores Espinales"],
    tips: [
      "Pies al ancho de hombros con puntas ligeramente hacia afuera (~20°).",
      "Inicia el movimiento quebrando caderas y rodillas simultáneamente.",
      "Baja al menos hasta que los muslos queden paralelos al suelo manteniendo el pecho alto."
    ],
    respiracion: "Inhala y compacta el abdomen al bajar; exhala con fuerza al subir."
  },
  "Prensa de Piernas 45°": {
    gif: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "leg_press",
    musculo_principal: "Cuádriceps y Glúteos",
    musculos_secundarios: ["Isquiosurales"],
    tips: [
      "Pies al centro de la plataforma. Nunca bloquees las rodillas por completo arriba.",
      "Baja el carro de forma controlada hasta unos 90° sin despegar la pelvis del respaldo."
    ],
    respiracion: "Inhala al descender; exhala al empujar la plataforma."
  },
  "Peso Muerto Rumano (RDL)": {
    gif: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "rdl",
    musculo_principal: "Isquiosurales y Glúteo Mayor",
    musculos_secundarios: ["Erectores Espinales", "Antebrazos"],
    tips: [
      "Empuja las caderas hacia atrás como si quisieras tocar una pared imaginaria con los glúteos.",
      "Mantén las rodillas con una flexión mínima y fija, y la barra pegada a las piernas."
    ],
    respiracion: "Inhala al bajar; exhala al contraer glúteos arriba."
  },
  "Hip Thrust con Barra": {
    gif: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "hip_thrust",
    musculo_principal: "Glúteo Mayor (Activación Máxima)",
    musculos_secundarios: ["Isquiosurales", "Cuádriceps"],
    tips: [
      "Apoya la parte media/baja de las escápulas en el banco.",
      "Empuja desde los talones hasta alinear torso, cadera y rodillas a 90° apretando glúteos arriba."
    ],
    respiracion: "Inhala abajo; exhala con fuerza arriba en el bloqueo."
  },

  // --- HOMBROS ---
  "Press Militar con Barra / Mancuernas": {
    gif: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "overhead_press",
    musculo_principal: "Deltoides Anterior y Medio",
    musculos_secundarios: ["Tríceps", "Trapecio", "Core"],
    tips: [
      "Glúteos y abdomen contraídos para proteger la zona lumbar.",
      "Empuja el peso verticalmente sobre la cabeza metiendo la cabeza ligeramente hacia adelante arriba."
    ],
    respiracion: "Inhala en el pecho; exhala al presionar hacia arriba."
  },
  "Elevaciones Laterales": {
    gif: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "lateral_raise",
    musculo_principal: "Deltoides Lateral (Hombros Redondos)",
    musculos_secundarios: ["Trapecio Superior"],
    tips: [
      "Eleva los brazos guiando con los codos ligeramente por delante del torso (plano escapular).",
      "Sube hasta la altura de los hombros sin balancear el cuerpo."
    ],
    respiracion: "Exhala al elevar; inhala al descender en 2 segundos."
  },
  "Pájaros / Face Pull en Polea": {
    gif: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "face_pull",
    musculo_principal: "Deltoides Posterior y Manguito Rotador",
    musculos_secundarios: ["Romboides", "Trapecio"],
    tips: [
      "Polea a la altura de los ojos. Tira de la cuerda hacia la cara separando las manos y rotando hombros hacia afuera.",
      "Abre los codos y aprieta la espalda alta 1 segundo."
    ],
    respiracion: "Exhala al tirar hacia la cara; inhala al regresar."
  },

  // --- BRAZOS ---
  "Curl de Bíceps con Barra Z": {
    gif: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "bicep_curl",
    musculo_principal: "Bíceps Braquial (Cabeza Corta y Larga)",
    musculos_secundarios: ["Braquial Anterior", "Antebrazos"],
    tips: [
      "Mantén los codos pegados a los costados y fijos durante toda la repetición.",
      "Sube apretando el bíceps y baja en 2-3 segundos completos sin balancear la espalda."
    ],
    respiracion: "Exhala al flexionar los brazos; inhala al extender."
  },
  "Curl Martillo con Mancuernas": {
    gif: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "hammer_curl",
    musculo_principal: "Braquial Anterior y Braquiorradial (Grosor)",
    musculos_secundarios: ["Bíceps"],
    tips: [
      "Palmas enfrentadas en agarre neutro. Flexiona los antebrazos manteniendo los codos inmóviles."
    ],
    respiracion: "Exhala al subir; inhala al bajar controladamente."
  },
  "Extensiones de Tríceps en Polea (Cuerda)": {
    gif: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    animacion_tipo: "tricep_pushdown",
    musculo_principal: "Tríceps Braquial (Cabeza Lateral y Medial)",
    musculos_secundarios: ["Antebrazos"],
    tips: [
      "Codos pegados a las costillas. Empuja la cuerda hacia abajo y ábrela al final del recorrido para máxima contracción."
    ],
    respiracion: "Exhala al empujar hacia abajo; inhala al flexionar."
  }
};

// Obtener datos visuales y técnica de un ejercicio por nombre o grupo
export function getExerciseVisual(nombre, grupoMuscular = "General") {
  if (EXERCISE_VISUALS[nombre]) {
    return EXERCISE_VISUALS[nombre];
  }

  // Fallback por grupo muscular
  const grupoDefaults = {
    Pecho: {
      gif: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
      musculo_principal: "Pectoral Mayor y Menor",
      musculos_secundarios: ["Tríceps", "Deltoides"],
      tips: ["Mantén el pecho erguido y las escápulas retraídas.", "Controla la fase excéntrica y empuja sin desalinear los codos."],
      respiracion: "Inhala al estirar el músculo; exhala al contraer."
    },
    Espalda: {
      gif: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80",
      musculo_principal: "Dorsales y Espalda Media",
      musculos_secundarios: ["Bíceps", "Trapecio"],
      tips: ["Inicia el movimiento con las escápulas y tira con los codos.", "Evita tirones bruscos con la zona lumbar."],
      respiracion: "Exhala al traccionar; inhala al extender."
    },
    Piernas: {
      gif: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
      musculo_principal: "Cuádriceps, Isquios y Glúteos",
      musculos_secundarios: ["Core", "Gemelos"],
      tips: ["Pies bien apoyados en el suelo o plataforma.", "Controla la profundidad y mantén la espalda neutra."],
      respiracion: "Inhala al descender; exhala al empujar."
    },
    Hombros: {
      gif: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      musculo_principal: "Deltoides (Anterior, Lateral y Posterior)",
      musculos_secundarios: ["Trapecio", "Tríceps"],
      tips: ["Trabaja en el plano escapular sin elevar excesivamente las clavículas.", "Elige un peso que permita rango completo sin balanceos."],
      respiracion: "Exhala en el esfuerzo; inhala al retornar."
    },
    Brazos: {
      gif: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
      musculo_principal: "Bíceps y Tríceps",
      musculos_secundarios: ["Antebrazos"],
      tips: ["Aislar el movimiento manteniendo los codos inmóviles.", "Apretar un segundo en el punto de máxima contracción."],
      respiracion: "Exhala al contraer; inhala al estirar."
    },
    Core: {
      gif: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      musculo_principal: "Recto Abdominal y Oblicuos",
      musculos_secundarios: ["Transverso", "Erectores Espinales"],
      tips: ["Mantén el abdomen contraído sin arquear la zona lumbar."],
      respiracion: "Respiración constante y controlada."
    }
  };

  return grupoDefaults[grupoMuscular] || grupoDefaults["Pecho"];
}
