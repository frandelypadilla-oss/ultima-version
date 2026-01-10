'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabase';

interface Wallpaper {
  id: number;
  name: string;
  irl: string;
  category?: string;
}

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // Para el efecto Tilt

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const { data } = await supabase.from('wallpapers').select('*');
        if (data) setWallpapers(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchWallpapers();
  }, []);

  const handleApplyDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name.toLowerCase()}.png`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      alert("¡Wallpaper guardado en tu galería! 🚀");
    } catch (e) { alert("Error al descargar."); }
  };

  const theme = {
    bg: darkMode ? '#0e0e1a' : '#e0e5ec', // Fondos más profundos / cálidos
    cardBg: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
    text: darkMode ? '#fff' : '#333',
    headerBg: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    shadowInner: darkMode ? 'inset 5px 5px 10px rgba(0,0,0,0.4), inset -5px -5px 10px rgba(40,40,60,0.2)' : 'inset 5px 5px 10px rgba(163,177,198,0.6), inset -5px -5px 10px #ffffff',
    shadowOuter: darkMode ? '10px 10px 20px rgba(0,0,0,0.5), -10px -10px 20px rgba(40,40,60,0.3)' : '10px 10px 20px rgba(163,177,198,0.6), -10px -10px 20px #ffffff',
  };

  // Efecto Tilt 3D
  const handleTilt = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = (x - rect.width / 2) / 20; // Más sensible
    const rotateX = (y - rect.height / 2) / -20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.boxShadow = `${theme.shadowOuter}, ${rotateY / 2}px ${rotateX / 2}px 15px rgba(0,0,0,0.3)`;
  };

  const resetTilt = (index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
      card.style.boxShadow = theme.shadowOuter;
    }
  };

  if (loading) return (
    <div style={{background: theme.bg, height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="shimmer-logo" style={{color: theme.text}}>
        <h1 style={{fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', margin: 0}}>iVibe</h1>
        <div style={{fontSize: '12px', fontWeight: '900', color: '#007AFF', letterSpacing: '3px', marginTop: '-5px'}}>PRO</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      
      {/* HEADER FLOTANTE (Solo si no hay wallpaper seleccionado) */}
      {!selectedWallpaper && (
        <div style={{ 
          position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)', 
          zIndex: 1000, width: '92%', maxWidth: '420px', display: 'flex', gap: '10px'
        }}>
          <header style={{ 
            padding: '10px 20px', background: theme.headerBg, backdropFilter: 'blur(35px) saturate(180%)',
            WebkitBackdropFilter: 'blur(35px) saturate(180%)', borderRadius: '30px', border: `0.5px solid ${theme.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1,
            boxShadow: theme.shadowOuter, transition: 'all 0.3s ease',
            animation: 'slideInDown 0.6s ease-out'
          }}>
            <div style={{textAlign: 'left'}}>
              <h1 style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-1px', margin: 0, color: theme.text }}>iVibe</h1>
              <span style={{ fontSize: '9px', color: '#007AFF', fontWeight: 'bold' }}>{wallpapers.length} ARTWORKS</span>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: theme.text }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </header>
        </div>
      )}

      <main style={{ width: '100%', maxWidth: '450px', padding: '0 18px' }}>
        <div style={{ height: '130px' }} /> {/* Espacio para el header */}

        {/* GRID con animaciones y Tilt */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingBottom: '100px' }}>
          {wallpapers.map((wp, index) => (
            <div 
              key={wp.id} 
              onClick={() => setSelectedWallpaper(wp)}
              ref={el => cardRefs.current[index] = el}
              onMouseMove={(e) => handleTilt(e, index)}
              onMouseLeave={() => resetTilt(index)}
              className="wallpaper-card"
              style={{ 
                position: 'relative', borderRadius: '40px', overflow: 'hidden', height: '360px', 
                background: theme.cardBg, border: `0.5px solid ${theme.border}`, cursor: 'pointer',
                boxShadow: theme.shadowOuter, transition: 'all 0.3s ease',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards` // Animación escalonada
              }}
            >
              <img src={wp.irl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', bottom: '20px', left: '20px', padding: '8px 16px',
                background: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', 
                backdropFilter: 'blur(15px)', borderRadius: '20px',
                color: '#fff', fontSize: '11px', fontWeight: 'bold', 
                border: darkMode ? '0.5px solid rgba(255,255,255,0.3)' : '0.5px solid rgba(0,0,0,0.1)',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
              }}>
                {wp.name}
              </div>
            </div>
          ))}
        </div>

        {/* MODAL DE PREVIEW */}
        {selectedWallpaper && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: darkMode ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(40px)',
            animation: 'fadeIn 0.4s ease'
          }}>
            <button 
              onClick={() => setSelectedWallpaper(null)} 
              style={{ 
                position: 'absolute', top: '40px', right: '30px', 
                background: theme.headerBg, border: `0.5px solid ${theme.border}`, color: theme.text, 
                width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', zIndex: 10,
                boxShadow: theme.shadowOuter
              }}
            >✕</button>

            <div style={{ width: '88%', maxWidth: '400px', textAlign: 'center' }}>
              <img src={selectedWallpaper.irl} className="preview-img" style={{ 
                width: '100%', borderRadius: '50px', 
                boxShadow: '0 60px 120px rgba(0,0,0,0.6)', 
                border: `0.5px solid ${theme.border}`,
                animation: 'zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }} />
              <div style={{ marginTop: '35px', animation: 'slideUp 0.6s ease-out 0.2s backwards' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '900', color: theme.text, margin: 0 }}>{selectedWallpaper.name}</h2>
                <div style={{ color: '#007AFF', fontWeight: '900', fontSize: '12px', letterSpacing: '2px', marginTop: '8px' }}>ULTRA HD</div>
                
                <button 
                  onClick={() => handleApplyDownload(selectedWallpaper.irl, selectedWallpaper.name)}
                  className="btn-apply-fancy"
                  style={{
                    background: darkMode ? 'linear-gradient(135deg, #4CAF50, #2E8B57)' : 'linear-gradient(135deg, #007AFF, #0056B3)',
                    color: '#fff', boxShadow: '0 15px 30px rgba(0,122,255,0.4)',
                    animation: 'bounceIn 0.8s ease-out'
                  }}
                >
                  DOWNLOAD & SET
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          body { 
            background-color: ${theme.bg}; 
            margin: 0; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
            transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1); 
            overflow-x: hidden;
            -webkit-tap-highlight-color: transparent; /* Evita el resalte azul en móviles */
          }

          .wallpaper-card {
            transform-style: preserve-3d;
            will-change: transform, box-shadow;
          }
          .wallpaper-card:hover {
            box-shadow: ${theme.shadowOuter}, 0 0 30px rgba(0,122,255,0.3); /* Brillo al pasar el ratón */
          }
          .wallpaper-card:active {
            transform: perspective(1000px) scale(0.98);
            transition: transform 0.2s ease-out;
          }

          .btn-apply-fancy {
            width: 100%; margin-top: 40px; padding: 25px; borderRadius: 30px;
            border: none; fontSize: '18px'; fontWeight: '900'; cursor: pointer;
            position: relative; overflow: hidden;
            transition: all 0.3s ease;
          }
          .btn-apply-fancy:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(0,122,255,0.6);
          }
          .btn-apply-fancy:active {
            transform: translateY(0px) scale(0.98);
          }

          /* Animaciones */
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInDown { from { opacity: 0; transform: translateY(-50px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          @keyframes shimmer-logo {
            0% { opacity: 0.2; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-10px); }
            100% { opacity: 0.2; transform: translateY(0); }
          }
          .shimmer-logo { animation: shimmer-logo 2.5s infinite ease-in-out; }
        `}</style>
      </main>
    </div>
  );
}