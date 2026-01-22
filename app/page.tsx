'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

interface Wallpaper {
  id: number;
  name: string;
  irl: string;
}

// BOT ROBOTIZADO INTEGRADO EN EL HEADER
const HarmonyBot = ({ scrollY }: { scrollY: number }) => {
  const rotation = Math.min(scrollY / 10, 15);
  return (
    <div className="bot-container" style={{ transform: `rotateX(${rotation}deg)` }}>
      <svg width="40" height="40" viewBox="0 0 100 100">
        <circle cx="50" cy="55" r="35" fill="url(#botGrad)" stroke="white" strokeWidth="1.5" />
        <path d="M25 45C25 35 35 28 50 28C65 28 75 35 75 45V52H25V45Z" fill="#121212" />
        <rect x="35" y="38" width="10" height="4" rx="2" fill="#00F0FF" className="eye" />
        <rect x="55" y="38" width="10" height="4" rx="2" fill="#00F0FF" className="eye" />
        <circle cx="50" cy="15" r="4" fill="#007BFF"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" /></circle>
        <defs><linearGradient id="botGrad" x1="50" y1="20" x2="50" y2="90"><stop stopColor="#FFF" /><stop offset="1" stopColor="#A0A0A0" /></linearGradient></defs>
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
    const fetchWps = async () => {
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
    window.addEventListener('scroll', () => setScrollY(window.scrollY));
  }, []);

  // FUNCIÓN DE DESCARGA CORREGIDA (EVITA ERRORES DE CORS)
  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Error al descargar. Intenta abrir la imagen en otra pestaña.");
    }
  };

  const theme = {
    bg: darkMode ? '#000' : '#F2F2F7',
    surface: darkMode ? 'rgba(28,28,30,0.7)' : 'rgba(255,255,255,0.8)',
    text: darkMode ? '#fff' : '#000',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  };

  if (loading) return <div className="loader">iVibe PRO</div>;

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: theme.text }}>
      
      {/* HEADER DINÁMICO */}
      <div className="nav-box">
        <nav className="glass-nav" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
          <span className="logo">iVibe</span>
          <HarmonyBot scrollY={scrollY} />
          <button onClick={() => setDarkMode(!darkMode)} className="tgl-btn">{darkMode ? '☀️' : '🌙'}</button>
        </nav>
      </div>

      <main className="content">
        <header className="title-area">
          <span className="tag">NEXT GEN</span>
          <h1>Discover Wallpapers</h1>
        </header>

        {/* GRID AJUSTADO (TARJETAS MÁS PEQUEÑAS) */}
        <div className="grid">
          {wallpapers.map((wp, i) => (
            <div key={wp.id} className="card" onClick={() => setSelectedWallpaper(wp)} style={{ animationDelay: `${i * 0.1}s` }}>
              <img src={wp.irl} loading="lazy" />
              <div className="card-label">{wp.name}</div>
            </div>
          ))}
        </div>

        {/* MODAL CORREGIDO */}
        {selectedWallpaper && (
          <div className="modal">
            <div className="overlay" onClick={() => setSelectedWallpaper(null)} />
            <div className="sheet" style={{ background: darkMode ? '#121212' : '#fff' }}>
              <div className="drag-handle" />
              <div className="preview-container">
                <img src={selectedWallpaper.irl} />
              </div>
              <div className="details">
                <h2>{selectedWallpaper.name}</h2>
                <div className="pills"><span>8K</span><span>OLED</span></div>
                <button 
                  className="dl-btn" 
                  onClick={() => handleDownload(selectedWallpaper.irl, selectedWallpaper.name)}
                >
                  DOWNLOAD NOW
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        body { margin: 0; font-family: 'Inter', sans-serif; overflow-x: hidden; background: ${theme.bg}; }
        
        /* HEADER */
        .nav-box { position: fixed; top: 15px; width: 100%; display: flex; justify-content: center; z-index: 1000; }
        .glass-nav { width: 90%; max-width: 400px; display: flex; justify-content: space-between; align-items: center; padding: 8px 20px; border-radius: 25px; backdrop-filter: blur(20px); }
        .logo { font-weight: 900; font-size: 1.2rem; }
        .tgl-btn { background: none; border: none; cursor: pointer; font-size: 1.2rem; color: inherit; }

        /* GRID (Ajuste de tamaño) */
        .content { max-width: 450px; margin: 0 auto; padding: 100px 16px 40px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .card { position: relative; height: 260px; border-radius: 24px; overflow: hidden; cursor: pointer; animation: reveal 0.6s ease forwards; opacity: 0; }
        @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .card img { width: 100%; height: 100%; object-fit: cover; }
        .card-label { position: absolute; bottom: 10px; left: 10px; font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.4); padding: 4px 10px; border-radius: 10px; color: white; backdrop-filter: blur(5px); }

        /* MODAL */
        .modal { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: flex-end; justify-content: center; }
        .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); }
        .sheet { width: 100%; max-width: 450px; height: 80vh; border-radius: 35px 35px 0 0; position: relative; padding: 20px; display: flex; flex-direction: column; animation: slideUp 0.5s cubic-bezier(0.2, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .drag-handle { width: 40px; height: 5px; background: #555; border-radius: 10px; margin: 0 auto 20px; }
        .preview-container { width: 100%; height: 60%; border-radius: 25px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .preview-container img { width: 100%; height: 100%; object-fit: cover; }
        .details { padding: 20px 0; text-align: center; }
        .pills { display: flex; justify-content: center; gap: 10px; margin: 10px 0; }
        .pills span { background: #007BFF; color: white; font-size: 10px; padding: 4px 12px; border-radius: 20px; font-weight: 800; }
        .dl-btn { width: 100%; padding: 18px; border-radius: 20px; border: none; background: #007BFF; color: white; font-weight: 800; font-size: 1rem; cursor: pointer; margin-top: 10px; }
        
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 2rem; }
        .eye { animation: blink 3s infinite; }
        @keyframes blink { 0%, 90%, 100% { opacity: 1; } 95% { opacity: 0; } }
      `}</style>
    </div>
  );
}