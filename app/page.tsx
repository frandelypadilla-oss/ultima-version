'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

interface Wallpaper {
  id: number;
  name: string;
  irl: string;
}

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [darkMode, setDarkMode] = useState(true); // Estado para el tema

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
      link.download = `${name.toLowerCase()}-ivibe.png`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      alert("¡Listo! Guardado en tu galería. 🚀");
    } catch (e) { alert("Error al descargar."); }
  };

  // Colores dinámicos estilo iOS 26
  const theme = {
    bg: darkMode ? '#000' : '#F2F2F7',
    card: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    text: darkMode ? '#fff' : '#000',
    header: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.4)',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    btnBg: darkMode ? '#fff' : '#000',
    btnText: darkMode ? '#000' : '#fff'
  };

  if (loading) return (
    <div style={{background: theme.bg, height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{padding:'40px', background: theme.card, borderRadius:'40px', backdropFilter:'blur(40px)', color: theme.text, fontSize: '24px', fontWeight: '900'}}>
        iVibe PRO
      </div>
    </div>
  );

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', transition: 'background 0.5s ease' }}>
      
      {/* HEADER FLOTANTE */}
      <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <header style={{ 
          padding: '12px 24px', background: theme.header, backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)', borderRadius: '24px', border: `0.5px solid ${theme.border}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-1.2px', margin: 0, color: theme.text }}>iVibe</h1>
          <div style={{ fontSize: '8px', fontWeight: '900', color: '#007AFF', letterSpacing: '1.5px', marginTop: '-2px' }}>PRO</div>
        </header>

        {/* BOTÓN MODO OSCURO / CLARO */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{
            marginLeft: '10px', width: '48px', height: '48px', borderRadius: '24px', border: `0.5px solid ${theme.border}`,
            background: theme.header, backdropFilter: 'blur(30px)', cursor: 'pointer', fontSize: '20px'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <main style={{ width: '100%', maxWidth: '430px', position: 'relative', zIndex: 1 }}>
        <div style={{ height: '120px' }} />

        {/* GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '0 15px 120px' }}>
          {wallpapers.map((wp) => (
            <div 
              key={wp.id} 
              onClick={() => setSelectedWallpaper(wp)}
              style={{ 
                borderRadius: '32px', overflow: 'hidden', height: '320px', 
                background: theme.card, border: `0.5px solid ${theme.border}`,
                boxShadow: darkMode ? 'none' : '0 10px 25px rgba(0,0,0,0.05)', cursor: 'pointer'
              }}
            >
              <img src={wp.irl} alt={wp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* MODAL DE PREVIEW */}
        {selectedWallpaper && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: darkMode ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.9)', 
            backdropFilter: 'blur(30px)', animation: 'fadeIn 0.3s ease'
          }}>
            <button 
              onClick={() => setSelectedWallpaper(null)}
              style={{ position: 'absolute', top: '40px', right: '30px', background: theme.header, border: 'none', color: theme.text, width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}
            >✕</button>

            <div style={{ width: '85%', maxWidth: '360px', textAlign: 'center' }}>
              <img src={selectedWallpaper.irl} style={{ width: '100%', borderRadius: '44px', boxShadow: '0 40px 80px rgba(0,0,0,0.3)', border: `0.5px solid ${theme.border}` }} />
              <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: theme.text, marginBottom: '5px' }}>{selectedWallpaper.name}</h2>
                <p style={{ fontSize: '12px', color: '#007AFF', fontWeight: '800', marginBottom: '25px' }}>iOS 26 GLASS EDITION</p>
                <button 
                  onClick={() => handleApplyDownload(selectedWallpaper.irl, selectedWallpaper.name)}
                  style={{
                    width: '100%', padding: '20px', borderRadius: '25px',
                    background: theme.btnBg, color: theme.btnText, border: 'none', 
                    fontSize: '15px', fontWeight: '900', cursor: 'pointer'
                  }}
                >
                  APPLY WALLPAPER
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          body { background-color: ${theme.bg}; margin: 0; transition: background 0.5s ease; overflow: ${selectedWallpaper ? 'hidden' : 'auto'}; }
        `}</style>
      </main>
    </div>
  );
}