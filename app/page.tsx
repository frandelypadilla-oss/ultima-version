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

  const sabiduria = [
    "La tecnología es un siervo útil, pero un amo peligroso. 🤖",
    "Tu wallpaper dice mucho de tu estado mental. Elige paz. ✨",
    "El modo oscuro es salud para tus ojos y tu batería. 🔋",
    "¿Ya tomaste agua? Tu cerebro procesa mejor hidratado. 💧",
    "No busques la felicidad en el scroll, búscala en lo que creas. 🎨",
    "Si algo no funciona, refactoriza tu actitud. 🚀",
    "Un setup minimalista es un atajo a una mente enfocada. 🧘‍♂️",
    "El fracaso es solo un bug que enseña a programar tu destino. 🛠️",
    "Menos notificaciones, más conversaciones reales. ⚖️",
    "Sé como una pantalla OLED: brilla y no gastes energía en lo oscuro. 💎"
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

      {/* HEADER FLOTANTE: No ocupa espacio real, deja ver el wallpaper detrás */}
      <header className="spatial-header">
        <div className="bot-layout">
          <div className="speech-bubble-premium">
            {botMessage}
          </div>
          <div className={`vibebot-core ${botMood}`} onClick={() => setBotMessage(sabiduria[Math.floor(Math.random() * sabiduria.length)])}>
            <div className="bot-body">
              <div className="bot-eyes"><div className="eye left"></div><div className="eye right"></div></div>
            </div>
            <div className="bot-ring"></div>
          </div>
        </div>
      </header>

      {/* SWIPE ARENA: Ahora ocupa el máximo espacio posible */}
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

      {/* ACCIONES INFERIORES */}
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
              <button className="download-premium" onClick={() => window.open(selected.irl)}>DOWNLOAD</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { margin: 0; background: #000; font-family: 'Plus Jakarta Sans', sans-serif; color: white; overflow: hidden; }
        .spatial-container { height: 100vh; display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .aurora-mesh { position: fixed; inset: 0; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a1a40 0%, #000 100%); filter: blur(60px); }

        /* HEADER FLOTANTE PARA MÁXIMO ESPACIO */
        .spatial-header { 
          position: absolute; top: 0; left: 0; width: 100%; 
          padding: 40px 0 0; z-index: 100; pointer-events: none; 
        }
        .bot-layout { 
          display: flex; flex-direction: column; align-items: center; 
          width: 85%; max-width: 400px; margin: 0 auto; gap: 10px; pointer-events: auto; 
        }

        .vibebot-core { position: relative; width: 60px; height: 60px; cursor: pointer; }
        .bot-body {
          width: 100%; height: 100%; background: white; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.4); animation: float 3s ease-in-out infinite;
        }
        .bot-eyes { display: flex; gap: 8px; }
        .eye { width: 6px; height: 6px; background: #000; border-radius: 50%; animation: blink 4s infinite; }
        .bot-ring { position: absolute; inset: -5px; border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 50%; animation: spin 10s linear infinite; }

        /* BURBUJA COMPACTA Y LEGIBLE */
        .speech-bubble-premium {
          background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(20px);
          padding: 10px 15px; border-radius: 18px;
          font-size: 11px; font-weight: 700; border: 1px solid rgba(255,255,255,0.1);
          color: #50e3c2; line-height: 1.3; text-align: center;
          width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* SWIPE ARENA A PANTALLA COMPLETA */
        .swipe-arena { 
          flex: 1; display: flex; align-items: center; justify-content: center; 
          padding-top: 60px; /* Espacio para que el bot no tape el centro */
        }
        .card-stack-wrapper { 
          position: relative; width: 92%; height: 85%; /* Wallpaper mucho más grande */
          max-width: 380px; max-height: 650px; 
        }
        .glass-card { 
          position: absolute; inset: 0; border-radius: 40px; overflow: hidden; 
          border: 1px solid rgba(255,255,255,0.1); transition: 0.5s cubic-bezier(0.2, 1, 0.3, 1); 
        }
        .main-card { z-index: 2; box-shadow: 0 30px 60px rgba(0,0,0,0.8); }
        .next-card { z-index: 1; transform: scale(0.9) translateY(10px); opacity: 0.2; }
        .glass-card img { width: 100%; height: 100%; object-fit: cover; }
        
        .card-content { position: absolute; bottom: 0; width: 100%; padding: 25px; box-sizing: border-box; }
        .content-blur { 
          background: rgba(0,0,0,0.4); backdrop-filter: blur(20px); 
          padding: 15px 20px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.1); 
        }

        .spatial-actions { padding: 20px 0 40px; display: flex; justify-content: center; gap: 20px; z-index: 100; }
        .action-btn { 
          width: 65px; height: 65px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); 
          background: rgba(255,255,255,0.05); color: white; font-size: 1.3rem; 
          backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center;
        }
        .btn-yes { color: #50e3c2; } .btn-no { color: #ff4b4b; }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        .right { transform: translateX(150%) rotate(20deg); opacity: 0; }
        .left { transform: translateX(-150%) rotate(-20deg); opacity: 0; }

        .spatial-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-end; }
        .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); }
        .liquid-sheet { width: 100%; background: #08080a; border-radius: 40px 40px 0 0; padding: 20px; position: relative; z-index: 2; border-top: 1px solid #222; }
        .sheet-preview { width: 100%; height: 400px; border-radius: 30px; overflow: hidden; }
        .sheet-preview img { width: 100%; height: 100%; object-fit: cover; }
        .download-premium { width: 100%; padding: 20px; border-radius: 20px; border: none; background: #007AFF; color: white; font-weight: 800; margin-top: 20px; }
      `}</style>
    </div>
  );
}