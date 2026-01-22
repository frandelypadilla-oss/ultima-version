'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabase';

interface Wallpaper {
  id: number;
  name: string;
  irl: string;
}

// Robot con diseño HarmonyOS 3D
const HarmonyBot = ({ scrollY }: { scrollY: number }) => {
  // El robot rotará y "mirará" hacia abajo según el scroll
  const rotation = Math.min(scrollY / 10, 20); 
  const eyeScale = 1 + Math.sin(scrollY / 50) * 0.2; // Los ojos parpadean/brillan al bajar

  return (
    <div className="bot-container" style={{ transform: `rotateX(${rotation}deg)` }}>
      <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
        {/* Cuerpo principal redondeado */}
        <circle cx="50" cy="55" r="35" fill="url(#botGradient)" stroke="white" strokeWidth="1.5" />
        {/* Cabeza / Visor */}
        <path d="M25 45C25 35 35 28 50 28C65 28 75 35 75 45V52H25V45Z" fill="#1A1A1A" />
        {/* Ojos LED Blue Neon */}
        <rect x="35" y="38" width="8" height="4" rx="2" fill="#00F0FF" style={{ transform: `scaleX(${eyeScale})`, transformOrigin: 'center' }}>
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="57" y="38" width="8" height="4" rx="2" fill="#00F0FF" style={{ transform: `scaleX(${eyeScale})`, transformOrigin: 'center' }}>
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </rect>
        {/* Antena */}
        <line x1="50" y1="28" x2="50" y2="15" stroke="white" strokeWidth="2" />
        <circle cx="50" cy="15" r="4" fill="#007BFF">
          <animate attributeName="fill" values="#007BFF;#00F0FF;#007BFF" dur="1.5s" repeatCount="indefinite" />
        </circle>
        
        <defs>
          <linearGradient id="botGradient" x1="50" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F0F0F0" />
            <stop offset="1" stopColor="#B0B0B0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const { data } = await supabase.from('wallpapers').select('*');
        if (data) setWallpapers(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchWallpapers();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApplyDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.png`;
    link.click();
  };

  const theme = {
    bg: darkMode ? '#000000' : '#F7F7F9',
    surface: darkMode ? 'rgba(28, 28, 30, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    text: darkMode ? '#FFFFFF' : '#000000',
    accent: '#007BFF',
    border: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
  };

  if (loading) return (
    <div style={{background: theme.bg, height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="loader-harmony" style={{color: theme.text}}>iVibe PRO</div>
    </div>
  );

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', transition: 'all 0.5s ease' }}>
      
      {/* HEADER CON EL BOT INCORPORADO */}
      {!selectedWallpaper && (
        <div className="nav-wrapper">
          <nav className="harmony-nav" style={{ 
            background: theme.surface, 
            border: `1px solid ${theme.border}`,
            color: theme.text
          }}>
            <div className="brand">
              <h1 className="logo-text">iVibe</h1>
            </div>

            {/* AQUÍ ESTÁ EL BOT EN LA BARRA */}
            <div className="header-bot">
              <HarmonyBot scrollY={scrollY} />
            </div>

            <button className="harmony-toggle" onClick={() => setDarkMode(!darkMode)} style={{ color: theme.text }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      )}

      <main style={{ maxWidth: '460px', margin: '0 auto', padding: '120px 20px 50px', position: 'relative' }}>
        <header style={{ marginBottom: '25px' }}>
          <p style={{ color: theme.accent, fontWeight: '800', fontSize: '11px', letterSpacing: '2px', margin: '0 0 5px 0' }}>PRO COLLECTION</p>
          <h2 style={{ color: theme.text, fontSize: '30px', fontWeight: '800', margin: 0 }}>Discover Art</h2>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {wallpapers.map((wp, index) => (
            <div key={wp.id} onClick={() => setSelectedWallpaper(wp)} className="harmony-card" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
              <img src={wp.irl} loading="lazy" className="card-img" />
              <div className="card-glass-label"><span>{wp.name}</span></div>
            </div>
          ))}
        </div>

        {/* MODAL SHEET */}
        {selectedWallpaper && (
          <div className="harmony-modal">
            <div className="modal-overlay" onClick={() => setSelectedWallpaper(null)} />
            <div className="harmony-sheet" style={{ background: darkMode ? '#121214' : '#FFFFFF' }}>
              <div className="drag-handle" onClick={() => setSelectedWallpaper(null)} />
              <div className="sheet-body">
                <div className="img-preview-box"><img src={selectedWallpaper.irl} className="full-img" /></div>
                <div className="info-box">
                  <h3 style={{ color: theme.text }}>{selectedWallpaper.name}</h3>
                  <button onClick={() => handleApplyDownload(selectedWallpaper.irl, selectedWallpaper.name)} className="harmony-btn" style={{ background: theme.accent }}>
                    DOWNLOAD WALLPAPER
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
          body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: ${theme.bg}; overflow-x: hidden; }
          
          .nav-wrapper { position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; display: flex; justify-content: center; padding-top: 15px; }
          .harmony-nav {
            width: 90%; max-width: 420px; padding: 8px 18px;
            border-radius: 28px; backdrop-filter: blur(25px) saturate(180%);
            display: flex; justify-content: space-between; alignItems: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }

          .header-bot { transform: translateY(5px); transition: all 0.3s ease; }
          .logo-text { font-size: 20px; font-weight: 800; margin: 0; letter-spacing: -1px; }
          .harmony-toggle { background: rgba(120,120,120,0.1); border: none; width: 38px; height: 38px; border-radius: 14px; cursor: pointer; }

          .harmony-card { position: relative; height: 320px; border-radius: 32px; overflow: hidden; transition: 0.3s; cursor: pointer; }
          .harmony-card:active { transform: scale(0.95); }
          .card-img { width: 100%; height: 100%; object-fit: cover; }
          .card-glass-label { position: absolute; bottom: 10px; left: 10px; right: 10px; padding: 10px; background: rgba(0,0,0,0.3); backdrop-filter: blur(10px); border-radius: 18px; color: white; font-size: 11px; font-weight: 700; text-align: center; }

          .harmony-modal { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: flex-end; justify-content: center; }
          .modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); }
          .harmony-sheet { position: relative; width: 100%; max-width: 440px; height: 85vh; border-radius: 40px 40px 0 0; animation: sheetUp 0.5s ease; overflow: hidden; }
          .drag-handle { width: 100%; padding: 20px; display: flex; justify-content: center; cursor: pointer; }
          .drag-handle::after { content: ''; width: 40px; height: 5px; background: rgba(120,120,120,0.3); border-radius: 10px; }
          .sheet-body { overflow-y: auto; padding: 0 24px 40px; }
          .img-preview-box { width: 100%; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
          .full-img { width: 100%; }
          .harmony-btn { width: 100%; padding: 20px; border-radius: 20px; border: none; color: white; font-weight: 800; margin-top: 20px; box-shadow: 0 10px 20px rgba(0,123,255,0.3); }

          @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          .loader-harmony { font-size: 24px; font-weight: 900; animation: pulse 1.5s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } }
        `}</style>
      </main>
    </div>
  );
}