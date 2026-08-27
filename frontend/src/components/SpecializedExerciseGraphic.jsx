import React, { useState, useEffect } from 'react';
import { Sparkles, Activity } from 'lucide-react';

export default function SpecializedExerciseGraphic({ type, exerciseName, muscleGroup }) {
  const [phase, setPhase] = useState(0); // 0 (start) to 1 (peak)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p === 0 ? 1 : 0));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Determinar qué gráfico especializado mostrar
  const renderScene = () => {
    switch (type) {
      // 1. Sentadilla Isométrica en Pared (Wall Sit)
      case 'wall_sit':
        return (
          <g>
            {/* Pared */}
            <rect x="30" y="20" width="8" height="160" fill="#475569" rx="2" />
            <line x1="30" y1="180" x2="190" y2="180" stroke="#64748b" strokeWidth="3" />
            {/* Espalda pegada a pared */}
            <line x1="42" y1="65" x2="42" y2="115" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Cabeza */}
            <circle cx="42" cy="50" r="10" fill="#38bdf8" />
            {/* Muslos a 90 grados horizontal */}
            <line x1="42" y1="115" x2="90" y2="115" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
            {/* Espinillas a 90 grados vertical */}
            <line x1="90" y1="115" x2="90" y2="180" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Pies */}
            <line x1="86" y1="180" x2="105" y2="180" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
            {/* Brazos cruzados */}
            <path d="M 42 75 Q 65 85 55 95" stroke="#38bdf8" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Badge Ángulo 90° */}
            <text x="100" y="112" fill="#fbbf24" fontSize="10" fontWeight="bold">90° Isométrico</text>
            <text x="45" y="40" fill="#38bdf8" fontSize="10" fontWeight="bold">Espalda en Pared</text>
          </g>
        );

      // 2. Clamshells / Almejas con Banda
      case 'clamshell':
        const clamAngle = phase === 1 ? 40 : 0;
        return (
          <g>
            {/* Suelo */}
            <line x1="20" y1="160" x2="180" y2="160" stroke="#475569" strokeWidth="3" />
            {/* Cabeza apoyada en brazo */}
            <circle cx="50" cy="135" r="9" fill="#38bdf8" />
            <path d="M 50 145 L 85 145" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Pierna inferior fija */}
            <path d="M 85 145 L 120 145 L 140 158" stroke="#64748b" strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* Pierna superior abriéndose (Almeja) */}
            <path 
              d={`M 85 145 L ${120 - clamAngle * 0.2} ${145 - clamAngle * 0.8} L 140 158`} 
              stroke="#34d399" 
              strokeWidth="8" 
              fill="none" 
              strokeLinecap="round" 
            />
            {/* Banda elástica */}
            <ellipse cx="115" cy={145 - clamAngle * 0.4} rx="6" ry={8 + clamAngle * 0.3} fill="none" stroke="#f43f5e" strokeWidth="3" />
            {/* Flecha de apertura */}
            <path d="M 125 135 Q 130 115 120 105" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeDasharray="3,3" />
            <text x="75" y="100" fill="#34d399" fontSize="10" fontWeight="bold">Apertura Glúteo Medio</text>
          </g>
        );

      // 3. Extensiones Terminales de Rodilla con Banda (TKE)
      case 'tke':
        const tkeBend = phase === 1 ? 0 : 15;
        return (
          <g>
            {/* Poste de anclaje de la banda */}
            <rect x="25" y="60" width="6" height="120" fill="#475569" rx="2" />
            <line x1="20" y1="180" x2="180" y2="180" stroke="#64748b" strokeWidth="3" />
            {/* Cuerpo de pie */}
            <circle cx="130" cy="50" r="10" fill="#38bdf8" />
            <line x1="130" y1="60" x2="130" y2="115" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Pierna trasera de apoyo */}
            <line x1="130" y1="115" x2="150" y2="180" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            {/* Pierna delantera activa con TKE */}
            <polyline 
              points={`130,115 ${115 + tkeBend},148 115,180`} 
              stroke="#34d399" 
              strokeWidth="8" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Banda elástica tensa en corva de rodilla */}
            <line x1="28" y1="140" x2={115 + tkeBend} y2="148" stroke="#f43f5e" strokeWidth="4" />
            <text x="50" y="80" fill="#34d399" fontSize="10" fontWeight="bold">Extensión Completa (TKE)</text>
            <text x="35" y="130" fill="#f43f5e" fontSize="9" fontWeight="bold">Banda Tensa</text>
          </g>
        );

      // 4. Rotación Torácica en Cuadrupedia
      case 'thoracic_rotation':
        const rotUp = phase === 1;
        return (
          <g>
            <line x1="20" y1="160" x2="180" y2="160" stroke="#475569" strokeWidth="3" />
            {/* Rodillas en suelo */}
            <circle cx="65" cy="155" r="4" fill="#38bdf8" />
            <line x1="65" y1="155" x2="95" y2="120" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            {/* Torso horizontal */}
            <line x1="95" y1="120" x2="140" y2="115" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Brazo de apoyo en suelo */}
            <line x1="140" y1="115" x2="140" y2="160" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
            {/* Cabeza */}
            <circle cx="152" cy="108" r="9" fill="#38bdf8" />
            {/* Brazo rotando (mano tras nuca rotando arriba/abajo) */}
            {rotUp ? (
              <polyline points="140,115 125,75 145,100" stroke="#fbbf24" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <polyline points="140,115 120,135 145,105" stroke="#38bdf8" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
            <text x="65" y="60" fill="#fbbf24" fontSize="10" fontWeight="bold">Apertura Torácica {rotUp ? '↑ 90°' : '↓'}</text>
          </g>
        );

      // 5. Dislocaciones de Hombro con Banda / Pica
      case 'shoulder_dislocations':
        const dislocY = phase === 1 ? 40 : 120;
        return (
          <g>
            <line x1="30" y1="180" x2="170" y2="180" stroke="#475569" strokeWidth="3" />
            <circle cx="100" cy="50" r="10" fill="#38bdf8" />
            <line x1="100" y1="60" x2="100" y2="125" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            <line x1="100" y1="125" x2="85" y2="180" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            <line x1="100" y1="125" x2="115" y2="180" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            {/* Brazos pasando por arriba */}
            <path d={`M 100 70 Q ${100 + (phase === 1 ? 30 : -30)} ${dislocY} ${phase === 1 ? 145 : 55} ${dislocY}`} stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Pica / Banda */}
            <line x1={phase === 1 ? 135 : 45} y1={dislocY - 15} x2={phase === 1 ? 155 : 65} y2={dislocY + 15} stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            <text x="45" y="30" fill="#fbbf24" fontSize="10" fontWeight="bold">Arco Completo 180°</text>
          </g>
        );

      // 6. Gato-Camello (Cat-Cow Pose)
      case 'cat_cow':
        const isCat = phase === 1;
        return (
          <g>
            <line x1="20" y1="160" x2="180" y2="160" stroke="#475569" strokeWidth="3" />
            {/* Cuatro apoyos */}
            <line x1="60" y1="160" x2="60" y2="125" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            <line x1="140" y1="160" x2="140" y2="125" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            {/* Columna arqueada (Gato) vs Columna hundida (Camello/Vaca) */}
            {isCat ? (
              <path d="M 60 125 Q 100 85 140 125" stroke="#34d399" strokeWidth="8" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 60 125 Q 100 150 140 125" stroke="#fbbf24" strokeWidth="8" fill="none" strokeLinecap="round" />
            )}
            {/* Cabeza */}
            <circle cx={isCat ? 150 : 152} cy={isCat ? 138 : 110} r="9" fill="#38bdf8" />
            <text x="55" y="65" fill={isCat ? '#34d399' : '#fbbf24'} fontSize="11" fontWeight="bold">
              {isCat ? '🐱 Gato (Arqueo Lumbar Arriba)' : '🐮 Camello (Apertura de Pecho)'}
            </text>
          </g>
        );

      // 7. Apertura de Cadera en 90/90
      case 'hip_90_90':
        return (
          <g>
            <line x1="20" y1="160" x2="180" y2="160" stroke="#475569" strokeWidth="3" />
            {/* Torso erguido */}
            <circle cx="100" cy="70" r="10" fill="#38bdf8" />
            <line x1="100" y1="80" x2="100" y2="135" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Pierna delantera a 90° */}
            <polyline points="100,135 145,135 145,160" stroke="#34d399" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pierna trasera a 90° */}
            <polyline points="100,135 60,135 60,160" stroke="#fbbf24" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="50" y="45" fill="#34d399" fontSize="10" fontWeight="bold">Posición 90° / 90° de Cadera</text>
          </g>
        );

      // 8. Puente de Glúteo Unipodal
      case 'glute_bridge_unipodal':
        const hipLift = phase === 1 ? 40 : 0;
        return (
          <g>
            <line x1="20" y1="165" x2="180" y2="165" stroke="#475569" strokeWidth="3" />
            {/* Cabeza y hombros en suelo */}
            <circle cx="45" cy="155" r="9" fill="#38bdf8" />
            {/* Torso elevándose */}
            <line x1="45" y1="155" x2="95" y2={155 - hipLift} stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Pierna de apoyo empujando talón */}
            <polyline points={`95,${155 - hipLift} 130,${155 - hipLift} 130,165`} stroke="#34d399" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pierna libre extendida al aire */}
            <line x1="95" y1={155 - hipLift} x2="145" y2={110 - hipLift * 0.8} stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" />
            <text x="60" y="70" fill="#34d399" fontSize="10" fontWeight="bold">Empuje de Glúteo Mayor</text>
          </g>
        );

      // 9. Dorsiflexión de Tobillo en Pared
      case 'ankle_wall_dorsiflexion':
        const kneeFwd = phase === 1 ? 25 : 0;
        return (
          <g>
            {/* Pared */}
            <rect x="160" y="20" width="8" height="160" fill="#475569" rx="2" />
            <line x1="20" y1="180" x2="180" y2="180" stroke="#64748b" strokeWidth="3" />
            {/* Pierna delantera en estocada hacia pared */}
            <circle cx="70" cy="70" r="10" fill="#38bdf8" />
            <line x1="70" y1="80" x2="85" y2="130" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Rodilla avanzando hacia la pared sin despegar talón */}
            <polyline points={`85,130 ${130 + kneeFwd},145 130,180`} stroke="#34d399" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pie plano en suelo */}
            <line x1="125" y1="180" x2="155" y2="180" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
            {/* Pierna trasera apoyada */}
            <polyline points="85,130 50,155 40,180" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
            <text x="40" y="45" fill="#34d399" fontSize="10" fontWeight="bold">Talón Pegado al Suelo</text>
            <text x="95" y="125" fill="#fbbf24" fontSize="9" fontWeight="bold">→ Hacia Pared</text>
          </g>
        );

      // 10. Elevación de Gemelos Excéntrica a 1 Pierna
      case 'eccentric_calf_raise':
        const heelDrop = phase === 1 ? 20 : -15;
        return (
          <g>
            {/* Escalón / Plataforma */}
            <rect x="70" y="145" width="80" height="35" fill="#334155" rx="2" />
            {/* Cuerpo erguido */}
            <circle cx="95" cy="45" r="9" fill="#38bdf8" />
            <line x1="95" y1="55" x2="95" y2="110" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Pierna libre recogida */}
            <polyline points="95,110 75,130 80,150" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Pierna activa sobre borde del escalón */}
            <polyline points={`95,110 95,${145 + heelDrop} 115,145`} stroke="#34d399" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="40" y="25" fill="#34d399" fontSize="10" fontWeight="bold">
              {phase === 1 ? '↓ Descenso Excéntrico Lento (4s)' : '↑ Elevación en Punta'}
            </text>
          </g>
        );

      // 11. Caminata en Talones y Puntas
      case 'heel_toe_walk':
        const isHeel = phase === 0;
        return (
          <g>
            <line x1="20" y1="170" x2="180" y2="170" stroke="#475569" strokeWidth="3" />
            <circle cx="100" cy="50" r="10" fill="#38bdf8" />
            <line x1="100" y1="60" x2="100" y2="120" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {isHeel ? (
              // Apoyo solo en talones, puntas levantadas
              <g>
                <polyline points="100,120 85,150 75,170" stroke="#38bdf8" strokeWidth="7" fill="none" strokeLinecap="round" />
                <line x1="75" y1="170" x2="60" y2="155" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
                <polyline points="100,120 115,150 125,170" stroke="#38bdf8" strokeWidth="7" fill="none" strokeLinecap="round" />
                <line x1="125" y1="170" x2="140" y2="155" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
                <text x="45" y="30" fill="#fbbf24" fontSize="11" fontWeight="bold">1. Caminata en Talones (Puntas Arriba)</text>
              </g>
            ) : (
              // Apoyo en puntas, talones elevados
              <g>
                <polyline points="100,120 85,145 85,170" stroke="#38bdf8" strokeWidth="7" fill="none" strokeLinecap="round" />
                <line x1="85" y1="170" x2="70" y2="170" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
                <polyline points="100,120 115,145 115,170" stroke="#38bdf8" strokeWidth="7" fill="none" strokeLinecap="round" />
                <line x1="115" y1="170" x2="130" y2="170" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
                <text x="45" y="30" fill="#34d399" fontSize="11" fontWeight="bold">2. Caminata en Puntas de Pie</text>
              </g>
            )}
          </g>
        );

      // 12. Posición del Niño (Child's Pose)
      case 'child_pose':
        return (
          <g>
            <line x1="20" y1="160" x2="180" y2="160" stroke="#475569" strokeWidth="3" />
            {/* Piernas plegadas bajo los glúteos */}
            <polyline points="50,160 50,140 75,150" stroke="#64748b" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Espalda estirada hacia adelante en el suelo */}
            <path d="M 50 140 Q 90 135 130 150" stroke="#38bdf8" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Cabeza apoyada hacia el suelo */}
            <circle cx="130" cy="148" r="8" fill="#38bdf8" />
            {/* Brazos totalmente extendidos al frente */}
            <line x1="125" y1="145" x2="175" y2="158" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
            <text x="45" y="60" fill="#34d399" fontSize="10" fontWeight="bold">Descompresión Dorsal y Lumbar</text>
            <text x="55" y="80" fill="#38bdf8" fontSize="9" fontWeight="bold">Brazos Extendidos al Frente</text>
          </g>
        );

      // 13. Cobra / Extensión Lumbar Suave
      case 'cobra_pose':
        return (
          <g>
            <line x1="20" y1="160" x2="180" y2="160" stroke="#475569" strokeWidth="3" />
            {/* Piernas y pelvis apoyadas en suelo */}
            <line x1="30" y1="160" x2="90" y2="160" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            {/* Torso arqueándose suavemente hacia arriba */}
            <path d="M 90 160 Q 115 140 130 95" stroke="#34d399" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Cabeza mirando al frente */}
            <circle cx="135" cy="85" r="9" fill="#38bdf8" />
            {/* Brazos empujando suavemente */}
            <polyline points="120,120 120,160 135,160" stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="40" y="45" fill="#34d399" fontSize="10" fontWeight="bold">Apertura de Pecho y Pared Abdominal</text>
          </g>
        );

      // 14. Estiramiento de Isquiosurales en Suelo
      case 'seated_hamstring_stretch':
        return (
          <g>
            <line x1="20" y1="160" x2="180" y2="160" stroke="#475569" strokeWidth="3" />
            {/* Pierna extendida en suelo */}
            <line x1="60" y1="160" x2="150" y2="160" stroke="#34d399" strokeWidth="8" strokeLinecap="round" />
            {/* Torso inclinándose hacia adelante con columna neutra */}
            <line x1="60" y1="160" x2="105" y2="115" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            <circle cx="112" cy="108" r="9" fill="#38bdf8" />
            {/* Brazos alcanzando la punta del pie */}
            <line x1="105" y1="115" x2="148" y2="155" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
            <text x="45" y="55" fill="#34d399" fontSize="10" fontWeight="bold">Estiramiento Cadena Posterior</text>
          </g>
        );

      // 15. Estiramiento de Cuádriceps y Psoas
      case 'standing_quad_stretch':
        return (
          <g>
            <line x1="30" y1="180" x2="170" y2="180" stroke="#475569" strokeWidth="3" />
            <circle cx="100" cy="50" r="10" fill="#38bdf8" />
            <line x1="100" y1="60" x2="100" y2="120" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            {/* Pierna de apoyo recta */}
            <line x1="100" y1="120" x2="100" y2="180" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            {/* Pierna flexionada hacia atrás con mano tomando el empeine */}
            <polyline points="100,120 100,155 80,125" stroke="#34d399" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="100" y1="80" x2="80" y2="125" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
            <text x="40" y="30" fill="#34d399" fontSize="10" fontWeight="bold">Talón Pegado al Glúteo (Cuádriceps)</text>
          </g>
        );

      // 16. Estiramiento Pectoral en Pared
      case 'wall_pec_stretch':
        return (
          <g>
            <rect x="25" y="20" width="8" height="160" fill="#475569" rx="2" />
            <line x1="20" y1="180" x2="180" y2="180" stroke="#64748b" strokeWidth="3" />
            <circle cx="95" cy="65" r="9" fill="#38bdf8" />
            <line x1="95" y1="75" x2="95" y2="135" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            <line x1="95" y1="135" x2="80" y2="180" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            <line x1="95" y1="135" x2="110" y2="180" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            {/* Brazo apoyado a 90° en la pared rotando el torso */}
            <polyline points="95,85 33,85 33,55" stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="45" y="35" fill="#fbbf24" fontSize="10" fontWeight="bold">Codo a 90° en Pared</text>
            <text x="95" y="105" fill="#34d399" fontSize="9" fontWeight="bold">Giro Opuesto</text>
          </g>
        );

      default:
        return (
          <g>
            <circle cx="100" cy="70" r="10" fill="#38bdf8" />
            <line x1="100" y1="80" x2="100" y2="140" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
            <line x1="100" y1="140" x2="80" y2="180" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
            <line x1="100" y1="140" x2="120" y2="180" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-2xl overflow-hidden relative select-none flex flex-col items-center">
      {/* Header con Indicador */}
      <div className="w-full flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Postura Biomecánica Exacta</span>
        </div>
        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          Guía Anatómica
        </span>
      </div>

      {/* SVG Canvas de Alta Definición */}
      <div className="w-full max-w-[300px] h-[195px] flex items-center justify-center relative my-1">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {renderScene()}
        </svg>
      </div>

      {/* Pie de escena */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
        <span className="flex items-center gap-1 text-slate-300 font-medium truncate">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          {exerciseName}
        </span>
        <span className="text-sky-400 font-mono font-bold shrink-0">{muscleGroup}</span>
      </div>
    </div>
  );
}
