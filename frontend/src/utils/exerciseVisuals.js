// Base de datos de Demostraciones Visuales con GIFs e Imágenes Reales de OpenGym

export const EXERCISE_VISUALS = {
  // --- PECHO ---
  "Press de Banca Plano con Barra": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0025-EIeI8Vf.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0025-EIeI8Vf.jpg",
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
    gif: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg",
    img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg",
    frames: ["Dumbbell_Bench_Press/0.jpg", "Dumbbell_Bench_Press/1.jpg"],
    musculo_principal: "Pectoral Mayor (Medio e Inferior)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps Braquial"],
    tips: [
      "Apoya los pies firmes y mantén las escápulas retraídas contra el banco.",
      "Baja las mancuernas con los codos a 45°-60° del torso sintiendo el estiramiento en el pecho.",
      "Empuja hacia arriba en trayectoria convergente sin chocar las pesas arriba."
    ],
    respiracion: "Inhala al descender; exhala al presionar hacia arriba."
  },
  "Empuje en Polea para Pecho": {
    gif: "/exercises/empuje_polea_pecho.png",
    img: "/exercises/empuje_polea_pecho.png",
    frames: ["Standing_Cable_Chest_Press/0.jpg", "Standing_Cable_Chest_Press/1.jpg", "/exercises/empuje_polea_pecho.png"],
    musculo_principal: "Pectoral Mayor y Core",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps Braquial", "Core / Abdomen"],
    tips: [
      "Colócate de pie o de rodillas en el centro de las poleas con un pie adelante para máxima estabilidad.",
      "Agarra las manijas a la altura media del pecho.",
      "Empuja hacia adelante extendiendo los brazos y apretando el pecho al final del movimiento.",
      "Vuelve controlando la tensión sin que los codos sobrepasen en exceso la línea de la espalda."
    ],
    respiracion: "Inhala al flexionar los codos; exhala al empujar hacia adelante."
  },
  "Press Inclinado con Barra": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0047-e16r95y.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0047-e16r95y.jpg",
    musculo_principal: "Pectoral Superior (Clavicular)",
    musculos_secundarios: ["Deltoides Anterior", "Tríceps"],
    tips: [
      "Banco inclinado a 30° - 45°.",
      "Baja la barra a la parte superior del esternón con control.",
      "Empuja verticalmente manteniendo las escápulas retraídas."
    ],
    respiracion: "Inhala al bajar; exhala al empujar."
  },
  "Press Inclinado con Mancuernas": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0314-a9K07N2.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0314-a9K07N2.jpg",
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
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0168-1p6f3F3.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0168-1p6f3F3.jpg",
    musculo_principal: "Pectoral Mayor (Aislamiento)",
    musculos_secundarios: ["Deltoides Anterior"],
    tips: [
      "Ligera flexión fija en los codos.",
      "Abre sintiendo el estiramiento del pecho y aprieta 1 segundo al cruzar."
    ],
    respiracion: "Inhala al abrir; exhala al juntar las manos."
  },
  "Flexiones de pecho (Push-ups)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/3216-7E06s6d.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/3216-7E06s6d.jpg",
    musculo_principal: "Pectoral y Tríceps",
    musculos_secundarios: ["Core", "Deltoides Anterior"],
    tips: [
      "Cuerpo alineado como una tabla recta desde la cabeza hasta los talones.",
      "Baja hasta que el pecho quede a 2 cm del suelo con codos a 45°."
    ],
    respiracion: "Inhala al bajar; exhala al empujar el suelo."
  },
  "Fondos en Paralelas (Dips)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/3287-LkoAWAE.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/3287-LkoAWAE.jpg",
    musculo_principal: "Pectoral Inferior y Tríceps",
    musculos_secundarios: ["Deltoides Anterior", "Core"],
    tips: [
      "Inclina el torso ligeramente hacia adelante.",
      "Baja hasta que los codos formen un ángulo de 90°."
    ],
    respiracion: "Inhala al bajar; exhala al subir."
  },
  "Press en Máquina Smith / Chest Press": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0574-e8K7b13.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0574-e8K7b13.jpg",
    musculo_principal: "Pectoral Mayor (Guiado)",
    musculos_secundarios: ["Tríceps", "Hombros"],
    tips: [
      "Ajusta la altura del asiento para que los agarres queden a nivel medio del pecho.",
      "Empuja de forma constante y controla la fase excéntrica."
    ],
    respiracion: "Inhala al descender; exhala al empujar."
  },

  // --- ESPALDA ---
  "Jalón al Pecho en Polea": {
    gif: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
    img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
    frames: ["Wide-Grip_Lat_Pulldown/0.jpg", "Wide-Grip_Lat_Pulldown/1.jpg"],
    musculo_principal: "Dorsal Ancho (Amplitud de Espalda)",
    musculos_secundarios: ["Bíceps", "Redondo Mayor", "Deltoides Posterior"],
    tips: [
      "Siéntate firme y toma la barra con agarre prono más ancho que los hombros.",
      "Tira de la barra hacia la clavícula sacando pecho y apretando las escápulas.",
      "Evita balancear la espalda hacia atrás en exceso."
    ],
    respiracion: "Inhala al estirar arriba; exhala al bajar la barra al pecho."
  },
  "Jalón al Pecho Agarre Supino / Estrecho": {
    gif: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Underhand_Cable_Pulldowns/0.jpg",
    img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Underhand_Cable_Pulldowns/0.jpg",
    frames: ["Underhand_Cable_Pulldowns/0.jpg", "Underhand_Cable_Pulldowns/1.jpg"],
    musculo_principal: "Dorsal Ancho y Bíceps (Tracción Vertical)",
    musculos_secundarios: ["Bíceps Braquial", "Redondo Mayor", "Trapecio Medio"],
    tips: [
      "Ajusta los rodillos para fijar bien los muslos y mantener el torso erguido con leve inclinación.",
      "Toma la barra con agarre supino (palmas mirando hacia tu cuerpo) al ancho de hombros.",
      "Tracciona hacia la parte alta del pecho guiando el movimiento con los codos hacia abajo y atrás.",
      "Controla el ascenso extendiendo los brazos sin encoger los hombros."
    ],
    respiracion: "Exhala al traccionar la barra hacia el pecho; inhala al extender los brazos."
  },
  "Dominadas (Pull-ups)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0652-3tP5t2H.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0652-3tP5t2H.jpg",
    musculo_principal: "Dorsales y Espalda Alta",
    musculos_secundarios: ["Bíceps", "Antebrazos", "Core"],
    tips: [
      "Agarre pronado ancho. Sube hasta pasar la barbilla por encima de la barra.",
      "Baja de forma controlada sin balanceos bruscos."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Remo con Barra": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0027-eZyBC3j.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0027-eZyBC3j.jpg",
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
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/3156-v2DfH14.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/3156-v2DfH14.jpg",
    musculo_principal: "Dorsal Ancho (Unilateral)",
    musculos_secundarios: ["Bíceps", "Deltoides Posterior"],
    tips: [
      "Apóyate en el banco con la espalda paralela al piso.",
      "Lleva la mancuerna hacia la cadera en trayectoria curva con el codo pegado al cuerpo."
    ],
    respiracion: "Exhala al subir; inhala al bajar estirando el dorsal."
  },
  "Remo en Polea Baja (Gironda)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0180-hvV79Si.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0180-hvV79Si.jpg",
    musculo_principal: "Espalda Media, Romboides y Dorsal",
    musculos_secundarios: ["Bíceps", "Trapecio"],
    tips: [
      "Mantén la espalda erguida con ligero arco natural.",
      "Tira del agarre hacia el abdomen bajo apretando las escápulas atrás 1 segundo.",
      "Vuelve controlando el peso sin encorvar la espalda."
    ],
    respiracion: "Exhala al traccionar hacia el ombligo; inhala al regresar."
  },

  // --- GLÚTEOS VARIADOS (DEDICADOS) ---
  "Hip Thrust con Barra": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1409-qKBpF7I.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1409-qKBpF7I.jpg",
    musculo_principal: "Glúteo Mayor (Fuerza e Hipertrofia)",
    musculos_secundarios: ["Isquiosurales", "Cuádriceps", "Core"],
    tips: [
      "Escápulas apoyadas en el borde del banco y barra con almohadilla sobre la pelvis.",
      "Empuja desde los talones hasta alinear torso y muslos a 90° apretando fuerte los glúteos arriba.",
      "Mantén la barbilla pegada al pecho (mirando al frente) durante todo el levantamiento."
    ],
    respiracion: "Inhala abajo; exhala al bloquear y apretar arriba."
  },
  "Kas Glute Bridge con Barra": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/3562-qg2PGl6.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/3562-qg2PGl6.jpg",
    musculo_principal: "Glúteo Mayor (Máxima Contracción Superior)",
    musculos_secundarios: ["Isquiosurales", "Core"],
    tips: [
      "Escápulas apoyadas en banco, rango de movimiento corto concentrado solo en el tercio superior.",
      "Mantén las espinillas perpendiculares y aprieta los glúteos 2 segundos en el punto más alto."
    ],
    respiracion: "Inhala al descender; exhala al bloquear la pelvis arriba."
  },
  "Hip Thrust Unilateral con Mancuerna": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/3013-u0cNiij.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/3013-u0cNiij.jpg",
    musculo_principal: "Glúteo Mayor (Unilateral)",
    musculos_secundarios: ["Estabilizadores de Cadera", "Core"],
    tips: [
      "Una pierna apoyada a 90° y la otra flexionada en el aire.",
      "Empuja desde el talón sintiendo el glúteo sin girar la pelvis."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Glute Bridge / Puente de Glúteo en Suelo": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1409-qKBpF7I.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1409-qKBpF7I.jpg",
    musculo_principal: "Glúteo Mayor y Cadena Posterior",
    musculos_secundarios: ["Isquiosurales", "Core"],
    tips: [
      "Tumbada en el suelo con rodillas a 90°.",
      "Eleva la pelvis hasta alinear rodillas y hombros contrayendo los glúteos 2 segundos."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Sentadilla Búlgara Enfocada a Glúteo": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0410-qx4fgX7.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0410-qx4fgX7.jpg",
    musculo_principal: "Glúteo Mayor y Cuádriceps",
    musculos_secundarios: ["Isquiotibiales", "Aductores"],
    tips: [
      "Paso más largo y torso inclinado hacia adelante a 45° con la espalda recta.",
      "Baja la cadera hacia atrás sintiendo el estiramiento profundo del glúteo de la pierna adelantada."
    ],
    respiracion: "Inhala al bajar profundo; exhala al empujar desde el talón."
  },
  "Patada de Glúteo en Polea (Cable Kickback)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0228-Kpajagk.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0228-Kpajagk.jpg",
    musculo_principal: "Glúteo Mayor (Aislamiento en Polea Baja)",
    musculos_secundarios: ["Isquiosurales", "Glúteo Medio"],
    tips: [
      "Tobillera enganchada a la polea baja, torso inclinado a 45° apoyando las manos en la estructura.",
      "Patea hacia atrás extendiendo la cadera y aprieta el glúteo 1 segundo en el punto más alto.",
      "Regresa de forma lenta y controlada sintiendo la resistencia continua del cable."
    ],
    respiracion: "Exhala al patear atrás; inhala al regresar controlado."
  },
  "Patada de Glúteo en Máquina / Cuadrupedia": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/2286-OPqShYN.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/2286-OPqShYN.jpg",
    musculo_principal: "Glúteo Mayor",
    musculos_secundarios: ["Isquiosurales"],
    tips: [
      "Empuja con la planta del pie hacia arriba y atrás manteniendo la espalda neutra.",
      "Pausa 1 segundo en máxima extensión apretando el glúteo."
    ],
    respiracion: "Exhala al empujar; inhala al flexionar."
  },
  "Abducciones de Cadera en Máquina": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0597-CHpahtl.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0597-CHpahtl.jpg",
    musculo_principal: "Glúteo Medio y Menor (Cadera Redonda)",
    musculos_secundarios: ["Tensor de la Fascia Lata"],
    tips: [
      "Siéntate con el torso inclinado hacia el frente para maximizar el reclutamiento del glúteo medio.",
      "Abre las piernas con fuerza y controla 2 segundos la vuelta."
    ],
    respiracion: "Exhala al abrir; inhala al cerrar."
  },
  "Abducciones de Cadera en Polea de Pie": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0168-hBGWILP.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0168-hBGWILP.jpg",
    musculo_principal: "Glúteo Medio",
    musculos_secundarios: ["Abductores"],
    tips: [
      "De lado a la polea baja, eleva la pierna exterior hacia el lateral sin rotar el torso.",
      "Mantén la pierna casi recta y controla la fase excéntrica."
    ],
    respiracion: "Exhala al abducir la pierna; inhala al bajar."
  },
  "Frog Pumps con Mancuerna": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/2429-FFRP97T.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/2429-FFRP97T.jpg",
    musculo_principal: "Glúteo Mayor y Glúteo Medio",
    musculos_secundarios: ["Piso Pélvico"],
    tips: [
      "Tumbada boca arriba con plantas de los pies juntas (posición de mariposa/rana).",
      "Eleva la pelvis contrayendo los glúteos al máximo en series de altas repeticiones."
    ],
    respiracion: "Exhala al elevar; inhala al tocar suelo."
  },
  "Cable Pull-Through en Polea Baja": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0196-OM46QHm.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0196-OM46QHm.jpg",
    musculo_principal: "Glúteo Mayor y Cadena Posterior",
    musculos_secundarios: ["Isquiosurales", "Erectores Espinales"],
    tips: [
      "De espaldas a la polea con cuerda entre las piernas.",
      "Empuja las caderas atrás manteniendo la espalda recta y extiende la cadera con fuerza de glúteo."
    ],
    respiracion: "Inhala al flexionar cadera; exhala al extender y apretar glúteos."
  },
  "Peso Muerto Rumano Unilateral (B-Stance RDL)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0085-wQ2c4XD.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0085-wQ2c4XD.jpg",
    musculo_principal: "Glúteo Mayor e Isquiosurales",
    musculos_secundarios: ["Core", "Glúteo Medio"],
    tips: [
      "Un pie apoyado completo y el otro pie retrasado como pata de cabra sobre la punta.",
      "Lleva las caderas hacia atrás sintiendo el estiramiento profundo del glúteo delantero."
    ],
    respiracion: "Inhala al bajar; exhala al subir empujando el suelo."
  },
  "Step-Ups en Cajón para Glúteo": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0431-aXtJhlg.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0431-aXtJhlg.jpg",
    musculo_principal: "Glúteo Mayor",
    musculos_secundarios: ["Cuádriceps", "Isquios"],
    tips: [
      "Pie delantero sobre un cajón a la altura de la rodilla.",
      "Empuja únicamente con el talón de arriba sin impulsarte con el pie del suelo."
    ],
    respiracion: "Exhala al subir; inhala al bajar en 3 segundos."
  },
  "Hiperextensiones a 45° Enfocadas a Glúteo": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1314-qLpO4vV.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1314-qLpO4vV.jpg",
    musculo_principal: "Glúteo Mayor",
    musculos_secundarios: ["Isquiosurales"],
    tips: [
      "Puntas de los pies abiertas a 45° y espalda alta ligeramente encorvada para desactivar la lumbar.",
      "Sube empujando la pelvis contra la almohadilla apretando los glúteos."
    ],
    respiracion: "Inhala al bajar; exhala al subir."
  },
  "Zancadas Invertidas para Glúteo": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/2796-gFyFj9z.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/2796-gFyFj9z.jpg",
    musculo_principal: "Glúteo Mayor",
    musculos_secundarios: ["Cuádriceps", "Isquiosurales"],
    tips: [
      "Da un paso amplio hacia atrás e inclina el torso 30° al frente.",
      "Baja la rodilla trasera casi al suelo y empuja desde el talón delantero."
    ],
    respiracion: "Inhala al dar el paso atrás; exhala al incorporarte."
  },

  // --- PIERNAS, CUÁDRICEPS, ADUCTORES & PANTORRILLAS ---
  "Aductores en Máquina": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0598-oHsrypV.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0598-oHsrypV.jpg",
    musculo_principal: "Aductores (Muslo Interno)",
    musculos_secundarios: ["Pectíneo", "Grácil"],
    tips: [
      "Espalda bien apoyada en el respaldo.",
      "Cierra las piernas de manera controlada apretando en el centro 1 segundo.",
      "Abre lentamente sintiendo el estiramiento del aductor sin dejar caer las placas."
    ],
    respiracion: "Exhala al cerrar las piernas; inhala al abrirlas."
  },
  "Pantorrilla en Prensa 45°": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0738-qCNVnaU.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0738-qCNVnaU.jpg",
    musculo_principal: "Gemelos / Gastrocnemio y Sóleo",
    musculos_secundarios: ["Tendón de Aquiles", "Fascia Plantar"],
    tips: [
      "Apoya solo la punta de los pies en el borde inferior de la plataforma de la prensa.",
      "Extiende los tobillos empujando la plataforma con la punta de los pies.",
      "Baja profundamente sintiendo el estiramiento completo en la pantorrilla sin flexionar las rodillas."
    ],
    respiracion: "Exhala al empujar hacia adelante; inhala al estirar hacia atrás."
  },
  "Elevación de Talones (Gemelos de Pie)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1372-8ozhUIZ.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1372-8ozhUIZ.jpg",
    musculo_principal: "Gemelos (Gastrocnemio)",
    musculos_secundarios: ["Sóleo", "Fascia Plantar"],
    tips: [
      "Eleva los talones al máximo sintiendo la contracción en la pantorrilla.",
      "Baja lentamente estirando por debajo del escalón."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Elevación de Talones Sentado (Sóleo)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0088-ktsFQAZ.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0088-ktsFQAZ.jpg",
    musculo_principal: "Sóleo (Pantorrilla Profunda)",
    musculos_secundarios: ["Gemelos"],
    tips: [
      "Rodillas a 90° con almohadilla sobre los muslos.",
      "Eleva los talones con fuerza pausando 1 segundo arriba."
    ],
    respiracion: "Exhala al subir; inhala al descender."
  },
  "Sentadilla con Barra (Back Squat)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0043-qXTaZnJ.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0043-qXTaZnJ.jpg",
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
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0739-10Z2DXU.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0739-10Z2DXU.jpg",
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
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0085-wQ2c4XD.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0085-wQ2c4XD.jpg",
    musculo_principal: "Isquiosurales y Glúteos",
    musculos_secundarios: ["Erectores Espinales"],
    tips: [
      "Empuja las caderas hacia atrás con las rodillas semi-flexionadas y fijas.",
      "Mantén la barra pegada a los muslos y la columna neutra."
    ],
    respiracion: "Inhala al bajar; exhala al subir apretando glúteos."
  },
  "Extensión de Cuádriceps": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0585-my33uHU.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0585-my33uHU.jpg",
    musculo_principal: "Cuádriceps (Aislamiento)",
    musculos_secundarios: ["Tendón Rotuliano"],
    tips: [
      "Espalda bien apoyada en el respaldo.",
      "Extiende las piernas con fuerza y pausa 1 segundo arriba antes de bajar lentamente."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
    "Press Pallof en Polea": {
    gif: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pallof_Press/0.jpg",
    img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pallof_Press/0.jpg",
    frames: ["Pallof_Press/0.jpg", "Pallof_Press/1.jpg"],
    musculo_principal: "Core y Abdomen (Anti-rotación del Torso)",
    musculos_secundarios: ["Oblicuos", "Transverso del Abdomen", "Glúteos"],
    tips: [
      "Coloca la polea a la altura del pecho y sitúate de costado al cable.",
      "Sujeta la manija pegada al pecho con ambas manos, rodillas semiflexionadas y abdomen activo.",
      "Extiende los brazos al frente de forma controlada resistiendo la fuerza del cable sin rotar el torso.",
      "Mantén la posición 2 segundos y regresa al pecho con control."
    ],
    respiracion: "Inhala con las manos pegadas al pecho; exhala mientras extiendes los brazos al frente."
  },
  "Caminata de Granjero con Mancuernas (Farmer's Walk)": {
    gif: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Farmers_Walk/0.jpg",
    img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Farmers_Walk/0.jpg",
    frames: ["Farmers_Walk/0.jpg", "Farmers_Walk/1.jpg"],
    musculo_principal: "Fuerza Global de Agarre, Antebrazos y Core",
    musculos_secundarios: ["Trapecio", "Core / Oblicuos", "Glúteos y Piernas"],
    tips: [
      "Toma un par de mancuernas pesadas manteniendo los hombros hacia atrás y el pecho erguido.",
      "Camina con pasos cortos, firmes y controlados sin balancear el torso.",
      "Mantén el abdomen contraído y la mirada al frente durante todo el recorrido."
    ],
    respiracion: "Respira de forma continua y rítmica sin aguantar el aire."
  },
  "Curl Femoral Sentado en Máquina": {
    gif: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg",
    img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg",
    frames: ["Seated_Leg_Curl/0.jpg", "Seated_Leg_Curl/1.jpg"],
    musculo_principal: "Isquiosurales (Femoral Sentado)",
    musculos_secundarios: ["Gemelos"],
    tips: [
      "Ajusta el respaldo para que la articulación de la rodilla coincida con el eje de la máquina.",
      "Fija bien el rodillo superior sobre los muslos y el rodillo inferior detrás de los tobillos.",
      "Flexiona las piernas hacia abajo y atrás apretando los isquiosurales al final.",
      "Regresa controlando el movimiento sin dejar caer las placas de peso."
    ],
    respiracion: "Exhala al flexionar las rodillas hacia abajo; inhala al retornar arriba."
  },
  "Curl Femoral Tumbado en Máquina": {
    gif: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg",
    img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg",
    frames: ["Lying_Leg_Curls/0.jpg", "Lying_Leg_Curls/1.jpg"],
    musculo_principal: "Isquiosurales (Femoral Tumbado)",
    musculos_secundarios: ["Gemelos", "Glúteos"],
    tips: [
      "Túmbate boca abajo con el rodillo apoyado sobre los tendones de Aquiles.",
      "Mantén la pelvis pegada al banco en todo momento.",
      "Flexiona las rodillas llevando los talones hacia los glúteos.",
      "Desciende de forma lenta y controlada."
    ],
    respiracion: "Exhala al subir el rodillo; inhala al descender."
  },

  // --- TRÍCEPS DEDICADOS Y PRECISOS ---
  "Extensiones de Tríceps en Polea (Cuerda)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0200-dU605di.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0200-dU605di.jpg",
    musculo_principal: "Tríceps Braquial (Cabeza Lateral y Medial)",
    musculos_secundarios: ["Antebrazos"],
    tips: [
      "Codos pegados a las costillas y hombros fijos.",
      "Extiende los brazos hacia abajo separando los extremos de la cuerda al final del recorrido.",
      "Pausa 1 segundo abajo y regresa controlando el peso hasta 90° de flexión."
    ],
    respiracion: "Exhala al empujar hacia abajo; inhala al regresar a 90°."
  },
  "Extensiones de Tríceps en Polea (Barra Recta)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0241-gAwDzB3.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0241-gAwDzB3.jpg",
    musculo_principal: "Tríceps Braquial (Fuerza y Sobrecarga)",
    musculos_secundarios: ["Antebrazos"],
    tips: [
      "Agarre prono con barra recta o V-bar.",
      "Empuja verticalmente hacia el suelo manteniendo los codos bloqueados a los lados del torso."
    ],
    respiracion: "Exhala al extender los codos; inhala al subir."
  },
  "Extensión de Tríceps sobre la Cabeza (Copa)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0194-2IxROQ1.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0194-2IxROQ1.jpg",
    musculo_principal: "Tríceps (Cabeza Larga)",
    musculos_secundarios: ["Hombros", "Core"],
    tips: [
      "Brazos elevados junto a las orejas con mancuerna o polea con cuerda.",
      "Flexiona los codos por detrás de la cabeza y extiende completamente hacia arriba.",
      "Mantén los codos cerrados sin abrirlos en exceso."
    ],
    respiracion: "Inhala al bajar detrás de la cabeza; exhala al extender arriba."
  },
  "Press Francés con Barra Z": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0060-h8LFzo9.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0060-h8LFzo9.jpg",
    musculo_principal: "Tríceps Braquial (Skull Crusher)",
    musculos_secundarios: ["Antebrazos"],
    tips: [
      "Acostada en banco plano con barra Z sobre el pecho.",
      "Baja la barra hacia la frente flexionando únicamente los codos.",
      "Extiende con fuerza manteniendo los brazos perpendiculares al suelo."
    ],
    respiracion: "Inhala al descender hacia la frente; exhala al extender."
  },
  "Patada de Tríceps con Mancuerna / Polea": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0333-W6PxUkg.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0333-W6PxUkg.jpg",
    musculo_principal: "Tríceps (Aislamiento Posterior)",
    musculos_secundarios: ["Deltoides Posterior"],
    tips: [
      "Torso inclinado paralelo al suelo con el codo pegado a la costilla.",
      "Extiende el antebrazo hacia atrás hasta que el brazo quede recto y aprieta 1 segundo.",
      "No bajes el codo durante la repetición."
    ],
    respiracion: "Exhala al extender el brazo atrás; inhala al flexionar a 90°."
  },
  "Fondos entre Bancos para Tríceps": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0019-J60bN17.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0019-J60bN17.jpg",
    musculo_principal: "Tríceps y Pectoral",
    musculos_secundarios: ["Deltoides Anterior"],
    tips: [
      "Manos apoyadas al ancho de caderas en el borde del banco.",
      "Baja el cuerpo verticalmente hasta que los codos formen 90° y empuja hacia arriba."
    ],
    respiracion: "Inhala al bajar; exhala al empujar arriba."
  },
  "Press de Banca Agarre Cerrado": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0030-J6Dx1Mu.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0030-J6Dx1Mu.jpg",
    musculo_principal: "Tríceps Braquial y Pectoral",
    musculos_secundarios: ["Deltoides Anterior"],
    tips: [
      "Manos al ancho de hombros sobre la barra.",
      "Baja la barra rozando los codos contra las costillas y empuja con fuerza de tríceps."
    ],
    respiracion: "Inhala al bajar; exhala al empujar."
  },

  // --- HOMBROS ---
  "Press Militar con Barra / Mancuernas": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0405-znQUdHY.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0405-znQUdHY.jpg",
    musculo_principal: "Deltoides Anterior y Medio",
    musculos_secundarios: ["Tríceps", "Trapecio", "Core"],
    tips: [
      "Glúteos y abdomen activos para no arquear la espalda.",
      "Empuja el peso verticalmente sobre la cabeza de manera fluida."
    ],
    respiracion: "Inhala abajo; exhala al empujar sobre la cabeza."
  },
  "Elevaciones Laterales": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0334-DsgkuIt.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0334-DsgkuIt.jpg",
    musculo_principal: "Deltoides Lateral (Hombros Redondos)",
    musculos_secundarios: ["Trapecio Superior"],
    tips: [
      "Eleva los brazos guiando con los codos ligeramente por delante del cuerpo.",
      "Sube hasta la altura de los hombros sin impulsos del torso."
    ],
    respiracion: "Exhala al subir; inhala al bajar en 2 segundos."
  },
  "Pájaros / Face Pull en Polea": {
    gif: "/exercises/face_pull.png",
    img: "/exercises/face_pull.png",
    frames: ["Face_Pull/0.jpg", "Face_Pull/1.jpg", "/exercises/face_pull.png"],
    musculo_principal: "Deltoides Posterior y Manguito Rotador",
    musculos_secundarios: ["Trapecio Medio e Inferior", "Romboides"],
    tips: [
      "Coloca la polea a la altura del rostro o superior con cuerda doble.",
      "Agarre neutro con los pulgares hacia atrás.",
      "Tira de la cuerda hacia la cara/ojos separando las manos y llevando los codos hacia afuera.",
      "Aprieta los deltoides posteriores y escápulas 1 segundo antes de regresar."
    ],
    respiracion: "Exhala al traccionar hacia la cara; inhala al volver a la posición inicial."
  },
  "Face Pull en Polea con Cuerda (Pull Face)": {
    gif: "/exercises/face_pull.png",
    img: "/exercises/face_pull.png",
    frames: ["Face_Pull/0.jpg", "Face_Pull/1.jpg", "/exercises/face_pull.png"],
    musculo_principal: "Deltoides Posterior y Manguito Rotador",
    musculos_secundarios: ["Trapecio Medio e Inferior", "Romboides"],
    tips: [
      "Coloca la polea a la altura del rostro o superior con cuerda doble.",
      "Agarre neutro con los pulgares hacia atrás.",
      "Tira de la cuerda hacia la cara/ojos separando las manos y llevando los codos hacia afuera.",
      "Aprieta los deltoides posteriores y escápulas 1 segundo antes de regresar."
    ],
    respiracion: "Exhala al traccionar hacia la cara; inhala al volver a la posición inicial."
  },

  // --- BÍCEPS & ANTEBRAZOS ---
  "Curl de Bíceps con Barra Z": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0447-6TG6x2w.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0447-6TG6x2w.jpg",
    musculo_principal: "Bíceps Braquial",
    musculos_secundarios: ["Braquial Anterior", "Antebrazos"],
    tips: [
      "Codos pegados a los costados y fijos.",
      "Sube apretando el bíceps y baja lentamente sin balanceos."
    ],
    respiracion: "Exhala al subir la barra; inhala al descender."
  },
  "Curl Martillo con Mancuernas": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0313-slDvUAU.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0313-slDvUAU.jpg",
    musculo_principal: "Braquial y Braquiorradial (Grosor del Brazo)",
    musculos_secundarios: ["Bíceps"],
    tips: [
      "Palmas mirándose entre sí durante todo el recorrido.",
      "Controla el descenso completo."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },

  // --- CORE ---
  "Plancha Abdominal": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0464-CosupLu.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0464-CosupLu.jpg",
    musculo_principal: "Core y Recto Abdominal",
    musculos_secundarios: ["Hombros", "Glúteos"],
    tips: [
      "Cuerpo alineado como una tabla horizontal.",
      "Aprieta abdomen y glúteos sin dejar caer la cadera."
    ],
    respiracion: "Respiración diafragmática continua."
  },
  "Elevación de Piernas Colgado": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0012-UGhRD1A.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0012-UGhRD1A.jpg",
    musculo_principal: "Abdomen Inferior y Flexores de Cadera",
    musculos_secundarios: ["Antebrazos", "Dorsales"],
    tips: [
      "Sube las piernas controlando el balanceo.",
      "Flexiona la pelvis hacia el pecho para máxima activación abdominal."
    ],
    respiracion: "Exhala al subir; inhala al bajar."
  },
  "Crunch en Polea Alta": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0985-225x2Vd.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0985-225x2Vd.jpg",
    musculo_principal: "Recto Abdominal",
    musculos_secundarios: ["Oblicuos"],
    tips: [
      "De rodillas, sujeta la cuerda detrás de la cabeza.",
      "Curva la columna llevando los codos hacia las rodillas apretando el abdomen."
    ],
    respiracion: "Exhala al contraer el abdomen; inhala al subir."
  },

  // --- CALENTAMIENTO Y MOVILIDAD ---
  "Dislocaciones de Hombro con Banda / Pica": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0997-peAeMR3.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0997-peAeMR3.jpg",
    specialized_type: "shoulder_dislocations",
    musculo_principal: "Movilidad de Hombros y Pectoral",
    musculos_secundarios: ["Manguito Rotador", "Trapecio"],
    tips: [
      "Toma una banda elástica o pica con agarre amplio.",
      "Pasa los brazos rectos por encima de la cabeza hacia atrás y regresa de forma fluida."
    ],
    respiracion: "Inhala al subir los brazos; exhala al llevarlos atrás."
  },
  "Gato-Camello (Cat-Cow) Columna": {
    specialized_type: "cat_cow",
    musculo_principal: "Movilidad de Columna y Lumbar",
    musculos_secundarios: ["Core", "Erectores Espinales"],
    tips: [
      "En cuatro apoyos, arquea la espalda hacia arriba metiendo la cabeza.",
      "Luego arquea hacia abajo mirando al frente abriendo el pecho."
    ],
    respiracion: "Exhala al arquear hacia arriba; inhala al descender el abdomen."
  },
  "Rotación Torácica en Cuadrupedia": {
    specialized_type: "thoracic_rotation",
    musculo_principal: "Movilidad Torácica y Dorsal",
    musculos_secundarios: ["Deltoides Posterior", "Romboides"],
    tips: [
      "Mano detrás de la cabeza en cuatro apoyos.",
      "Gira el codo hacia el techo abriendo el torso al máximo (90°)."
    ],
    respiracion: "Exhala al rotar hacia arriba; inhala al bajar el codo."
  },
  "Apertura de Cadera en 90/90": {
    specialized_type: "hip_90_90",
    musculo_principal: "Cápsula Articular de la Cadera",
    musculos_secundarios: ["Glúteo Medio", "Aductores"],
    tips: [
      "Sentada en el suelo con ambas piernas formando ángulos de 90°.",
      "Gira las rodillas de un lado a otro manteniendo el torso erguido."
    ],
    respiracion: "Respira hondo y relajada en cada cambio."
  },

  // --- REHABILITACIÓN DE RODILLA & TOBILLO ---
  "Sentadilla Isométrica en Pared (Wall Sit)": {
    specialized_type: "wall_sit",
    musculo_principal: "Cuádriceps y Tendón Rotuliano",
    musculos_secundarios: ["Glúteos", "Core"],
    tips: [
      "Espalda apoyada en la pared y muslos paralelos al suelo a 90°.",
      "Mantén la posición sin balancearte activando los cuádriceps."
    ],
    respiracion: "Respiraciones diafragmáticas lentas y continuas."
  },
  "Extensiones Terminales de Rodilla con Banda (TKE)": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/3007-Y1MsI1l.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/3007-Y1MsI1l.jpg",
    specialized_type: "tke",
    musculo_principal: "Vasto Medial del Cuádriceps (Estabilidad de Rodilla)",
    musculos_secundarios: ["Isquiosurales"],
    tips: [
      "Banda elástica detrás de la corva de la rodilla anclada al frente.",
      "Extiende la rodilla hacia atrás apretando el cuádriceps 2 segundos."
    ],
    respiracion: "Exhala al extender la pierna; inhala al flexionar."
  },
  "Puente de Glúteo Unipodal": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1409-qKBpF7I.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1409-qKBpF7I.jpg",
    specialized_type: "glute_bridge_unipodal",
    musculo_principal: "Glúteo Mayor y Cadena Posterior",
    musculos_secundarios: ["Isquiotibiales", "Core"],
    tips: [
      "Una pierna apoyada y la otra elevada al aire.",
      "Eleva la pelvis hasta alinear la rodilla y el torso apretando el glúteo."
    ],
    respiracion: "Exhala al elevar la pelvis; inhala al descender."
  },
  "Clamshells / Almejas con Banda": {
    specialized_type: "clamshell",
    musculo_principal: "Glúteo Medio (Prevención de Valgo de Rodilla)",
    musculos_secundarios: ["Rotadores de Cadera"],
    tips: [
      "Recostada de lado con rodillas flexionadas a 90° y banda en los muslos.",
      "Abre la rodilla superior manteniendo los talones juntos sin girar la pelvis."
    ],
    respiracion: "Exhala al abrir la rodilla; inhala al cerrar."
  },
  "Monster Walk / Pasos con Banda": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0628-O95afRA.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0628-O95afRA.jpg",
    specialized_type: "clamshell",
    musculo_principal: "Glúteo Medio y Abductores",
    musculos_secundarios: ["Cuádriceps", "Tobillos"],
    tips: [
      "Banda en los tobillos o rodillas en posición de media sentadilla.",
      "Da pasos laterales manteniendo la tensión constante en la banda."
    ],
    respiracion: "Respiración constante y controlada."
  },
  "Dorsiflexión de Tobillo en Pared": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1368-uL9CsKm.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1368-uL9CsKm.jpg",
    specialized_type: "ankle_wall_dorsiflexion",
    musculo_principal: "Tendón de Aquiles y Movilidad de Tobillo",
    musculos_secundarios: ["Sóleo", "Gemelos"],
    tips: [
      "Pie a 8-10 cm de la pared en posición de estocada.",
      "Lleva la rodilla hacia la pared sin despegar el talón del piso."
    ],
    respiracion: "Exhala al adelantar la rodilla; inhala al regresar."
  },
  "Elevación de Gemelos Excéntrica a 1 Pierna": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/0999-9JprnPh.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/0999-9JprnPh.jpg",
    specialized_type: "eccentric_calf_raise",
    musculo_principal: "Gemelos y Tendón de Aquiles",
    musculos_secundarios: ["Planta del pie"],
    tips: [
      "Sube con ambos pies sobre un escalón.",
      "Quita un pie y baja con una sola pierna muy lentamente en 4 segundos por debajo del escalón."
    ],
    respiracion: "Exhala al subir; inhala durante los 4 segundos de bajada."
  },
  "Caminata en Talones y Puntas": {
    specialized_type: "heel_toe_walk",
    musculo_principal: "Tibial Anterior y Estabilidad de Tobillo",
    musculos_secundarios: ["Gemelos", "Fascia Plantar"],
    tips: [
      "Camina 20 pasos sobre los talones levantando las puntas de los pies.",
      "Luego camina 20 pasos sobre las puntas de los pies con talones altos."
    ],
    respiracion: "Respiración fluida."
  },

  // --- ESTIRAMIENTOS Y VUELTA A LA CALMA ---
  "Estiramiento de Isquiosurales en Suelo": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1560-yRYyfdA.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1560-yRYyfdA.jpg",
    specialized_type: "seated_hamstring_stretch",
    musculo_principal: "Isquiosurales y Cadena Posterior",
    musculos_secundarios: ["Lumbar", "Gemelos"],
    tips: [
      "Pierna extendida al frente con espalda recta.",
      "Inclínate desde la cadera hacia la punta del pie sin curvar la columna."
    ],
    respiracion: "Inhala profundo; exhala relajando y profundizando el estiramiento."
  },
  "Estiramiento de Cuádriceps y Psoas": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1512-qBcKorM.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1512-qBcKorM.jpg",
    specialized_type: "standing_quad_stretch",
    musculo_principal: "Cuádriceps y Flexores de Cadera",
    musculos_secundarios: ["Abdomen"],
    tips: [
      "Toma el empeine por detrás llevando el talón al glúteo.",
      "Mantén las rodillas juntas y empuja ligeramente la pelvis hacia adelante."
    ],
    respiracion: "Sostén 30 segundos respirando con calma."
  },
  "Posición del Niño (Child's Pose)": {
    specialized_type: "child_pose",
    musculo_principal: "Espalda Completa, Dorsales y Cadera",
    musculos_secundarios: ["Hombros", "Columna"],
    tips: [
      "De rodillas, siéntate sobre los talones y estira los brazos al frente en el suelo.",
      "Deja caer el pecho hacia el piso relajando cuello y hombros."
    ],
    respiracion: "Respiraciones profundas y lentas sintiendo la apertura dorsal."
  },
  "Cobra / Extensión Lumbar Suave": {
    specialized_type: "cobra_pose",
    musculo_principal: "Pared Abdominal y Descompresión Lumbar",
    musculos_secundarios: ["Pectorales", "Flexores"],
    tips: [
      "Tumbada boca abajo, apoya las palmas al lado de los hombros.",
      "Extiende los brazos suavemente levantando el pecho sin despegar la pelvis."
    ],
    respiracion: "Inhala al elevar el pecho; exhala relajando la tensión."
  },
  "Estiramiento Pectoral en Pared": {
    gif: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/gif/1259-QoHIhPl.gif",
    img: "https://raw.githubusercontent.com/arvids-unavailable/openGym/main/media/img/1259-QoHIhPl.jpg",
    specialized_type: "wall_pec_stretch",
    musculo_principal: "Pectoral Mayor y Menor",
    musculos_secundarios: ["Deltoides Anterior", "Bíceps"],
    tips: [
      "Apoya el antebrazo en una pared o marco de puerta a 90°.",
      "Gira el torso en dirección contraria sintiendo la apertura en el pecho."
    ],
    respiracion: "Mantén 20-30 segundos por lado de forma relajada."
  }
};

function normalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\(\)\/\-_,\.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getExerciseVisual(nombre, grupoMuscular = "General") {
  if (!nombre) return EXERCISE_VISUALS["Press de Banca Plano con Barra"];

  // 1. Coincidencia directa exacta
  if (EXERCISE_VISUALS[nombre]) {
    return EXERCISE_VISUALS[nombre];
  }

  const norm = normalize(nombre);

  // --- ADUCTORES & ABDUCTORES ---
  if (norm.includes("aductor") || norm.includes("adductor") || norm.includes("aduccion") || norm.includes("adduction")) {
    return EXERCISE_VISUALS["Aductores en Máquina"];
  }

  // --- PANTORRILLAS / GEMELOS / SÓLEO ---
  if (norm.includes("pantorrilla") || norm.includes("gemelo") || norm.includes("soleo") || norm.includes("pantorrillas") || norm.includes("gemelos") || norm.includes("calf")) {
    if (norm.includes("prensa") || norm.includes("press") || norm.includes("sled") || norm.includes("45")) {
      return EXERCISE_VISUALS["Pantorrilla en Prensa 45°"];
    }
    if (norm.includes("sentad") || norm.includes("seated") || norm.includes("banco")) {
      return EXERCISE_VISUALS["Elevación de Talones Sentado (Sóleo)"];
    }
    return EXERCISE_VISUALS["Elevación de Talones (Gemelos de Pie)"];
  }

  // --- TRÍCEPS (CUALQUIER VARIACIÓN Y EJERCICIO CUSTOM) ---
  if (norm.includes("tricep") || norm.includes("triceps") || norm.includes("triceps") || norm.includes("frances") || norm.includes("skull crusher") || norm.includes("pushdown") || norm.includes("copa")) {
    if (norm.includes("copa") || norm.includes("cabeza") || norm.includes("overhead") || norm.includes("tras nuca") || norm.includes("nuca")) {
      return EXERCISE_VISUALS["Extensión de Tríceps sobre la Cabeza (Copa)"];
    }
    if (norm.includes("frances") || norm.includes("french") || norm.includes("skull") || norm.includes("crusher") || norm.includes("rompecraneo")) {
      return EXERCISE_VISUALS["Press Francés con Barra Z"];
    }
    if (norm.includes("patada") || norm.includes("kickback")) {
      return EXERCISE_VISUALS["Patada de Tríceps con Mancuerna / Polea"];
    }
    if (norm.includes("fondo") || norm.includes("dip") || norm.includes("banco") || norm.includes("paralela")) {
      return EXERCISE_VISUALS["Fondos entre Bancos para Tríceps"];
    }
    if (norm.includes("cerrado") || norm.includes("estrecho") || norm.includes("close grip")) {
      return EXERCISE_VISUALS["Press de Banca Agarre Cerrado"];
    }
    if (norm.includes("barra") || norm.includes("recta") || norm.includes("v bar") || norm.includes("v-bar")) {
      return EXERCISE_VISUALS["Extensiones de Tríceps en Polea (Barra Recta)"];
    }
    return EXERCISE_VISUALS["Extensiones de Tríceps en Polea (Cuerda)"];
  }

  // --- GLÚTEOS ---
  if (norm.includes("kas") || norm.includes("kas bridge")) return EXERCISE_VISUALS["Kas Glute Bridge con Barra"];
  if (norm.includes("hip thrust") && (norm.includes("unilateral") || norm.includes("mancuerna") || norm.includes("1 pierna"))) return EXERCISE_VISUALS["Hip Thrust Unilateral con Mancuerna"];
  if (norm.includes("hip thrust")) return EXERCISE_VISUALS["Hip Thrust con Barra"];
  if (norm.includes("glute bridge") || norm.includes("puente")) return EXERCISE_VISUALS["Glute Bridge / Puente de Glúteo en Suelo"];
  if (norm.includes("bulgara") || norm.includes("split squat")) return EXERCISE_VISUALS["Sentadilla Búlgara Enfocada a Glúteo"];
  if ((norm.includes("patada") || norm.includes("kickback")) && (norm.includes("gluteo") || norm.includes("pierna") || norm.includes("cadera"))) {
    if (norm.includes("maquina") || norm.includes("cuadrupedia")) return EXERCISE_VISUALS["Patada de Glúteo en Máquina / Cuadrupedia"];
    return EXERCISE_VISUALS["Patada de Glúteo en Polea (Cable Kickback)"];
  }
  if (norm.includes("abducc") && norm.includes("maquina")) return EXERCISE_VISUALS["Abducciones de Cadera en Máquina"];
  if (norm.includes("abducc") && norm.includes("polea")) return EXERCISE_VISUALS["Abducciones de Cadera en Polea de Pie"];
  if (norm.includes("abducc") || norm.includes("abductor")) return EXERCISE_VISUALS["Abducciones de Cadera en Máquina"];
  if (norm.includes("frog") || norm.includes("rana")) return EXERCISE_VISUALS["Frog Pumps con Mancuerna"];
  if (norm.includes("pull through") || norm.includes("pull-through")) return EXERCISE_VISUALS["Cable Pull-Through en Polea Baja"];
  if (norm.includes("b stance") || norm.includes("b-stance") || (norm.includes("rdl") && norm.includes("unilateral"))) return EXERCISE_VISUALS["Peso Muerto Rumano Unilateral (B-Stance RDL)"];
  if (norm.includes("sumo")) return EXERCISE_VISUALS["Sentadilla Sumo con Mancuerna / Kettlebell"];
  if (norm.includes("step up") || norm.includes("step-up") || norm.includes("cajon") || norm.includes("banco subida")) return EXERCISE_VISUALS["Step-Ups en Cajón para Glúteo"];
  if (norm.includes("hiperextens")) return EXERCISE_VISUALS["Hiperextensiones a 45° Enfocadas a Glúteo"];
  if (norm.includes("zancada invertida") || norm.includes("lunge invertido")) return EXERCISE_VISUALS["Zancadas Invertidas para Glúteo"];

  // --- ESPALDA ---
  if (norm.includes("remo") && (norm.includes("polea") || norm.includes("gironda") || norm.includes("sentado") || norm.includes("baja"))) return EXERCISE_VISUALS["Remo en Polea Baja (Gironda)"];
  if (norm.includes("serrucho") || (norm.includes("remo") && (norm.includes("mancuerna") || norm.includes("unilateral")))) return EXERCISE_VISUALS["Remo Unilateral con Mancuerna (Serrucho)"];
  if (norm.includes("remo")) return EXERCISE_VISUALS["Remo con Barra"];
  if (norm.includes("jalon") && (norm.includes("supino") || norm.includes("estrech") || norm.includes("cerrad") || norm.includes("chin"))) return EXERCISE_VISUALS["Jalón al Pecho Agarre Supino / Estrecho"];
  if (norm.includes("jalon") || (norm.includes("polea") && norm.includes("pecho") && !norm.includes("empuje") && !norm.includes("press")) || norm.includes("lat pulldown")) return EXERCISE_VISUALS["Jalón al Pecho en Polea"];
  if (norm.includes("dominada") || norm.includes("pull up") || norm.includes("chin up")) return EXERCISE_VISUALS["Dominadas (Pull-ups)"];

  // --- PECHO ---
  if ((norm.includes("empuje") || norm.includes("press")) && norm.includes("polea") && norm.includes("pecho")) return EXERCISE_VISUALS["Empuje en Polea para Pecho"];
  if (norm.includes("inclinad") && (norm.includes("press") || norm.includes("mancuerna") || norm.includes("pecho"))) return EXERCISE_VISUALS["Press Inclinado con Mancuernas"];
  if (norm.includes("mancuerna") && (norm.includes("press") || norm.includes("pecho"))) return EXERCISE_VISUALS["Press de Banca Plano con Mancuernas"];
  if (norm.includes("smith") || norm.includes("chest press")) return EXERCISE_VISUALS["Press en Máquina Smith / Chest Press"];
  if (norm.includes("apertura") || norm.includes("cruce") || norm.includes("crossover") || norm.includes("peck deck")) return EXERCISE_VISUALS["Aperturas en Polea (Cruces)"];
  if (norm.includes("flexion") || norm.includes("push up")) return EXERCISE_VISUALS["Flexiones de pecho (Push-ups)"];
  if (norm.includes("fondo") || norm.includes("dip") || norm.includes("paralela")) return EXERCISE_VISUALS["Fondos en Paralelas (Dips)"];
  if (norm.includes("press") && (norm.includes("banca") || norm.includes("pecho") || norm.includes("plano") || norm.includes("barra"))) return EXERCISE_VISUALS["Press de Banca Plano con Barra"];

  // --- PIERNAS & CUÁDRICEPS ---
  if (norm.includes("prensa") || norm.includes("leg press")) return EXERCISE_VISUALS["Prensa de Piernas 45°"];
  if (norm.includes("sentadilla") || norm.includes("squat") || norm.includes("hack")) return EXERCISE_VISUALS["Sentadilla con Barra (Back Squat)"];
  if (norm.includes("peso muerto") || norm.includes("rdl") || norm.includes("rumano") || norm.includes("deadlift")) return EXERCISE_VISUALS["Peso Muerto Rumano (RDL)"];
  if (norm.includes("sillon") || (norm.includes("extension") && norm.includes("cuadriceps"))) return EXERCISE_VISUALS["Extensión de Cuádriceps"];
  if ((norm.includes("femoral") || norm.includes("isquio") || norm.includes("leg curl")) && norm.includes("sentad")) return EXERCISE_VISUALS["Curl Femoral Sentado en Máquina"];
  if (norm.includes("femoral") || norm.includes("isquio") || norm.includes("leg curl")) return EXERCISE_VISUALS["Curl Femoral Tumbado en Máquina"];
  if (norm.includes("pallof")) return EXERCISE_VISUALS["Press Pallof en Polea"];
  if (norm.includes("granjero") || norm.includes("farmer")) return EXERCISE_VISUALS["Caminata de Granjero con Mancuernas (Farmer's Walk)"];

  // --- HOMBROS ---
  if (norm.includes("lateral") || norm.includes("vuelo") || (norm.includes("elevacion") && norm.includes("hombro"))) return EXERCISE_VISUALS["Elevaciones Laterales"];
  if (norm.includes("face pull") || norm.includes("pull face") || norm.includes("pajaro") || norm.includes("rear delt")) return EXERCISE_VISUALS["Face Pull en Polea con Cuerda (Pull Face)"] || EXERCISE_VISUALS["Pájaros / Face Pull en Polea"];
  if (norm.includes("militar") || (norm.includes("press") && norm.includes("hombro"))) return EXERCISE_VISUALS["Press Militar con Barra / Mancuernas"];

  // --- BÍCEPS & ANTEBRAZOS ---
  if (norm.includes("martillo")) return EXERCISE_VISUALS["Curl Martillo con Mancuernas"];
  if (norm.includes("curl") || norm.includes("biceps")) return EXERCISE_VISUALS["Curl de Bíceps con Barra Z"];

  // --- CORE ---
  if (norm.includes("plancha") || norm.includes("plank")) return EXERCISE_VISUALS["Plancha Abdominal"];
  if (norm.includes("pierna") && (norm.includes("elevacion") || norm.includes("colgado"))) return EXERCISE_VISUALS["Elevación de Piernas Colgado"];
  if (norm.includes("crunch") || norm.includes("abdominal")) return EXERCISE_VISUALS["Crunch en Polea Alta"];

  // --- CALENTAMIENTO, REHABILITACIÓN & ESTIRAMIENTOS ---
  if (norm.includes("wall sit") || (norm.includes("sentadilla") && norm.includes("pared"))) return EXERCISE_VISUALS["Sentadilla Isométrica en Pared (Wall Sit)"];
  if (norm.includes("clamshell") || norm.includes("almeja")) return EXERCISE_VISUALS["Clamshells / Almejas con Banda"];
  if (norm.includes("monster") || norm.includes("walk")) return EXERCISE_VISUALS["Monster Walk / Pasos con Banda"];
  if (norm.includes("tke") || (norm.includes("extensi") && norm.includes("rodilla"))) return EXERCISE_VISUALS["Extensiones Terminales de Rodilla con Banda (TKE)"];
  if (norm.includes("toracica") || norm.includes("toracico")) return EXERCISE_VISUALS["Rotación Torácica en Cuadrupedia"];
  if (norm.includes("gato") || norm.includes("camello") || norm.includes("cat cow")) return EXERCISE_VISUALS["Gato-Camello (Cat-Cow) Columna"];
  if (norm.includes("dislocaci")) return EXERCISE_VISUALS["Dislocaciones de Hombro con Banda / Pica"];
  if (norm.includes("dorsiflexi") || (norm.includes("tobillo") && norm.includes("pared"))) return EXERCISE_VISUALS["Dorsiflexión de Tobillo en Pared"];
  if (norm.includes("talon") && norm.includes("punta")) return EXERCISE_VISUALS["Caminata en Talones y Puntas"];
  if (norm.includes("niño") || norm.includes("child")) return EXERCISE_VISUALS["Posición del Niño (Child's Pose)"];
  if (norm.includes("cobra")) return EXERCISE_VISUALS["Cobra / Extensión Lumbar Suave"];
  if (norm.includes("cuadriceps") && norm.includes("estira")) return EXERCISE_VISUALS["Estiramiento de Cuádriceps y Psoas"];
  if (norm.includes("isquio") && norm.includes("estira")) return EXERCISE_VISUALS["Estiramiento de Isquiosurales en Suelo"];
  if (norm.includes("pectoral") && norm.includes("pared")) return EXERCISE_VISUALS["Estiramiento Pectoral en Pared"];
  if (norm.includes("90 90") || norm.includes("90/90")) return EXERCISE_VISUALS["Apertura de Cadera en 90/90"];

  // 3. Fallback inteligente por grupo muscular
  const grupoLow = normalize(grupoMuscular);
  if (grupoLow.includes("gluteo")) return EXERCISE_VISUALS["Hip Thrust con Barra"];
  if (grupoLow.includes("espalda")) return EXERCISE_VISUALS["Remo en Polea Baja (Gironda)"];
  if (grupoLow.includes("pecho")) return EXERCISE_VISUALS["Press de Banca Plano con Barra"];
  if (grupoLow.includes("brazo") || grupoLow.includes("tricep")) return EXERCISE_VISUALS["Extensiones de Tríceps en Polea (Cuerda)"];
  if (grupoLow.includes("biceps")) return EXERCISE_VISUALS["Curl de Bíceps con Barra Z"];
  if (grupoLow.includes("hombro")) return EXERCISE_VISUALS["Press Militar con Barra / Mancuernas"];
  if (grupoLow.includes("core") || grupoLow.includes("abdom")) return EXERCISE_VISUALS["Plancha Abdominal"];
  if (grupoLow.includes("pierna")) return EXERCISE_VISUALS["Sentadilla con Barra (Back Squat)"];

  return EXERCISE_VISUALS["Press de Banca Plano con Barra"];
}
