'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function IVibeProSpatial() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [botMood, setBotMood] = useState('happy');
  const [botMessage, setBotMessage] = useState("¡Desliza para brillar! ✨");

  // EL CEREBRO DEL ROBOT
  const sabiduria = [
    "La tecnología es un siervo útil, pero un amo peligroso. Úsala con propósito. 🤖",
    "Tu wallpaper dice mucho de tu estado mental. Elige paz. ✨",
    "El modo oscuro no es solo estética, es salud para tus ojos y tu batería. 🔋",
    "¿Ya tomaste agua hoy? Tu cerebro procesa mejor los píxeles hidratado. 💧",
    "No busques la felicidad en el scroll infinito, búscala en lo que creas. 🎨",
    "La vida es como el código: si algo no funciona, refactoriza tu actitud. 🚀",
    "Un setup minimalista es un atajo a una mente enfocada. 🧘‍♂️",
    "El fracaso es solo un bug que te enseña a programar mejor tu destino. 🛠️",
    "Menos notificaciones, más conversaciones reales. Equilibrio digital. ⚖️",
    "Sé como una pantalla OLED: brilla por ti mismo y no gastes energía en lo oscuro. 💎"
  ];

  useEffect(() => {
    const fetchWps = async () => {
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDir(direction);
    setBotMood(direction === 'right' ? 'excited' : 'thinking');
    
    // Cambia a un mensaje inteligente aleatorio al deslizar
    const nuevoMensaje = sabiduria[Math.floor(Math.random() * sabiduria.length)];
    setBotMessage(nuevoMensaje);

    setTimeout(() => {
      setSwipeDir(null);
      setCurrentIndex((prev) => (prev + 1) % wallpapers.length);
      setBotMood('happy');
    }, 400);
  };

  if (loading) return <div className="loading-state">iVibe PRO</div>;

  const currentWp = wallpapers[currentIndex];
  const nextWp = wallpapers[(currentIndex + 1) % wallpapers.length];

  return (
    <div className="spatial-container">
      <div className="aurora-mesh" />

      {/* ROBOT PROTAGONISTA REDISEÑADO */}
      <header className="spatial-header">
        <div className={`vibebot-core ${botMood}`} onClick={() => setBotMessage(sabiduria[Math.floor(Math.random() * sabiduria.length)])}>
          <div className="bot-body">
            <div className="bot-eyes">
              <div className="eye left"></div>
              <div className="eye right"></div>
            </div>
            <div className="bot-mouth"></div>
          </div>
          <div className="bot-ring"></div>
          <div className="bot-shadow"></div>
          <div className="speech-bubble-premium">
            {botMessage}
          </div>
        </div>
      </header>

      {/* STACK DE TARJETAS */}
      <main className="swipe-arena">
        <div className="card-stack-wrapper">
          {nextWp && (
            <div className="glass-card next-card">
              <img src={nextWp.irl} alt="" />
            </div>
          )}
          {currentWp && (
            <div className={`glass-card main-card ${swipeDir}`}>
              <div className="liquid-reflection" />
              <img src={currentWp.irl} alt={currentWp.name} />
              <div className="card-content">
                <div className="content-blur">
                  <h2>{currentWp.name}</h2>
                  <div className="specs">
                    <span>8K RES</span><span className="dot">•</span><span>PREMIUM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BOTONES */}
      <footer className="spatial-actions">
        <button className="action-btn btn-no" onClick={() => handleSwipe('left')}>✕</button>
        <button className="action-btn btn-info" onClick={() => setSelected(currentWp)}>i</button>
        <button className="action-btn btn-yes" onClick={() => handleSwipe('right')}>♥</button>
      </footer>

      {/* MODAL DETALLE */}
      {selected && (
        <div className="spatial-modal">
          <div className="modal-backdrop" onClick={() => setSelected(null)} />
          <div className="liquid-sheet">
            <div className="sheet-preview">
              <img src={selected.irl} alt="" />
            </div>
            <div className="sheet-body">
              <h1>{selected.name}</h1>
              <button className="download-premium" onClick={() => window.open(selected.irl)}>
                DOWNLOAD ASSET
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { margin: 0; background: #020205; font-family: 'Plus Jakarta Sans', sans-serif; color: white; overflow: hidden; }
        .spatial-container { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        .aurora-mesh { position: fixed; inset: 0; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a1a40 0%, #000 100%); filter: blur(60px); }

        /* VIBEBOT 3.0 EVOLVED */
        .spatial-header { padding: 40px 0; display: flex; justify-content: center; position: relative; }
        .vibebot-core { position: relative; width: 80px; height: 80px; cursor: pointer; }
        
        .bot-body {
          width: 100%; height: 100%; background: linear-gradient(135deg, #fff 0%, #d1d1d1 100%);
          border-radius: 50%; position: relative; z-index: 10;
          box-shadow: inset -5px -5px 15px rgba(0,0,0,0.2), 0 0 30px rgba(0, 240, 255, 0.4);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          animation: float 3s ease-in-out infinite;
        }

        .bot-eyes { display: flex; gap: 12px; margin-bottom: 5px; }
        .eye { 
          width: 10px; height: 10px; background: #121212; border-radius: 50%; 
          animation: blink 4s infinite; transition: 0.3s;
        }

        /* ESTADOS DEL BOT */
        .excited .eye { height: 12px; background: #007AFF; box-shadow: 0 0 10px #007AFF; }
        .thinking .eye { width: 12px; height: 3px; border-radius: 2px; }

        .bot-ring {
          position: absolute; top: -10%; left: -10%; width: 120%; height: 120%;
          border: 2px solid rgba(0, 240, 255, 0.3); border-radius: 50%;
          animation: spin 10s linear infinite;
        }

        .speech-bubble-premium {
          position: absolute; left: 100px; top: -10px; width: 180px;
          background: rgba(255,255,255,0.1); backdrop-filter: blur(20px);
          padding: 12px 18px; border-radius: 25px 25px 25px 0;
          font-size: 11px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2);
          animation: fadeIn 0.5s ease;
          color: #50e3c2; line-height: 1.4;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        /* CARD STACK */
        .swipe-arena { flex: 1; display: flex; align-items: center; justify-content: center; }
        .card-stack-wrapper { position: relative; width: 85%; max-width: 340px; height: 480px; }
        .glass-card { position: absolute; inset: 0; border-radius: 40px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); transition: 0.5s cubic-bezier(0.2, 1, 0.3, 1); }
        .main-card { z-index: 2; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .next-card { z-index: 1; transform: scale(0.9) translateY(20px); opacity: 0.4; }
        .glass-card img { width: 100%; height: 100%; object-fit: cover; }
        .card-content { position: absolute; bottom: 0; width: 100%; padding: 20px; }
        .content-blur { background: rgba(0,0,0,0.4); backdrop-filter: blur(20px); padding: 15px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.1); }

        /* ANIMACIONES SWIPE */
        .right { transform: translateX(200%) rotate(30deg); }
        .left { transform: translateX(-200%) rotate(-30deg); }

        /* ACTIONS */
        .spatial-actions { padding: 40px; display: flex; justify-content: center; gap: 20px; }
        .action-btn { 
          width: 65px; height: 65px; border-radius: 50%; border: none; 
          background: rgba(255,255,255,0.05); color: white; font-size: 1.5rem; 
          backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); transition: 0.3s;
        }
        .btn-yes:active { background: #50e3c2; }
        .btn-no:active { background: #ff4b4b; }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

        /* MODAL */
        .spatial-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-end; }
        .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); }
        .liquid-sheet { width: 100%; background: #08080a; border-radius: 40px 40px 0 0; padding: 20px; position: relative; z-index: 2; border-top: 1px solid rgba(255,255,255,0.1); animation: slideUp 0.5s ease; }
        .sheet-preview { width: 100%; height: 350px; border-radius: 30px; overflow: hidden; }
        .sheet-preview img { width: 100%; height: 100%; object-fit: cover; }
        .download-premium { width: 100%; padding: 20px; border-radius: 20px; border: none; background: #007AFF; color: white; font-weight: 800; margin-top: 20px; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .loading-state { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 2rem; color: #007AFF; }
      `}</style>
    </div>
  );
}