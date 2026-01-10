'use client';
import React, { useEffect, useState, useRef } from 'react';
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
  const [darkMode, setDarkMode] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    } catch (e) { alert("Error al descargar."); }
  };

  const theme = {
    bg: darkMode ? '#050505' : '#F2F2F7',
    cardBg: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    text: darkMode ? '#FFFFFF' : '#1C1C1E',
    headerBg: darkMode ? 'rgba(15,15,15,0.7)' : 'rgba(255,255,255,0.7)',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    accent: '#007AFF'
  };

  if (loading) return (
    <div style={{background: theme.bg, height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="loader-vibe" style={{color: theme.text}}>iVibe PRO</div>
    </div>
  );

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', transition: 'background 0.8s ease', overflowX: 'hidden' }}>
      
      {/* HEADER FLOTANTE - Solo si no hay wallpaper seleccionado */}
      {!selectedWallpaper && (
        <div className="header-wrapper">
          <header className="glass-header" style={{ background: theme.headerBg, border: `0.5px solid ${theme.border}` }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.8px', margin: 0, color: theme.text }}>iVibe</h1>
              <span style={{ fontSize: '9px', color: theme.accent, fontWeight: '800', letterSpacing: '1px' }}>{wallpapers.length} ARTWORKS</span>
            </div>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} style={{ color: theme.text }}>
              {darkMode ? '☼' : '☾'}
            </button>
          </header>
        </div>
      )}

      <main style={{ maxWidth: '450px', margin: '0 auto', padding: '120px 16px 40px' }}>
        
        {/* GRID DE WALLPAPERS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {wallpapers.map((wp, index) => (
            <div 
              key={wp.id} 
              onClick={() => setSelectedWallpaper(wp)}
              className="card-item"
              style={{ 
                background: theme.cardBg, 
                border: `0.5px solid ${theme.border}`,
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
              }}
            >
              <img src={wp.irl} loading="lazy" />
              <div className="card-info-badge">{wp.name}</div>
            </div>
          ))}
        </div>

        {/* MODAL SYSTEM (BOTTOM SHEET STYLE) */}
        {selectedWallpaper && (
          <div className="modal-root">
            <div className="modal-backdrop" onClick={() => setSelectedWallpaper(null)} />
            
            <div className="modal-sheet" style={{ 
              background: darkMode ? '#121212' : '#FFFFFF',
              borderTop: `0.5px solid ${theme.border}`
            }}>
              <div className="pull-bar" onClick={() => setSelectedWallpaper(null)}><div className="bar" /></div>
              
              <div className="modal-inner-content">
                <div className="image-container">
                  <img src={selectedWallpaper.irl} className="preview-img" />
                </div>
                
                <div className="text-container">
                  <h2 style={{ color: theme.text, fontSize: '26px', fontWeight: '900', margin: '0' }}>{selectedWallpaper.name}</h2>
                  <p style={{ color: theme.accent, fontSize: '12px', fontWeight: '800', letterSpacing: '1px', marginTop: '5px' }}>8K RESOLUTION • PRO ASSET</p>
                  
                  <button 
                    onClick={() => handleApplyDownload(selectedWallpaper.irl, selectedWallpaper.name)}
                    className="download-btn"
                    style={{ background: theme.text, color: theme.bg }}
                  >
                    DOWNLOAD WALLPAPER
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }

          .header-wrapper {
            position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
            display: flex; justify-content: center; padding-top: 25px;
            animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .glass-header {
            width: 88%; max-width: 400px; padding: 12px 24px;
            border-radius: 30px; backdrop-filter: blur(25px) saturate(180%);
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }

          .theme-toggle {
            background: rgba(120,120,120,0.1); border: none; width: 42px; height: 42px;
            border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px;
          }

          .card-item {
            position: relative; height: 340px; border-radius: 38px; overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer;
          }

          .card-item:active { transform: scale(0.95); filter: brightness(0.9); }
          .card-item img { width: 100%; height: 100%; object-fit: cover; }

          .card-info-badge {
            position: absolute; bottom: 15px; left: 15px; right: 15px;
            padding: 10px; background: rgba(0,0,0,0.3); backdrop-filter: blur(10px);
            border-radius: 20px; color: white; font-size: 11px; font-weight: 700;
            text-align: center; border: 0.5px solid rgba(255,255,255,0.2);
          }

          /* MODAL SHEET CSS */
          .modal-root { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: flex-end; justify-content: center; }
          .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(15px); animation: fadeIn 0.4s ease; }
          
          .modal-sheet {
            position: relative; width: 100%; max-width: 430px; height: 82vh;
            border-radius: 40px 40px 0 0; display: flex; flex-direction: column;
            animation: sheetUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
          }

          .pull-bar { width: 100%; padding: 16px; display: flex; justify-content: center; cursor: pointer; }
          .bar { width: 40px; height: 5px; background: rgba(120,120,120,0.3); border-radius: 10px; }

          .modal-inner-content { overflow-y: auto; padding: 0 24px 40px; display: flex; flex-direction: column; align-items: center; }
          
          .image-container { width: 100%; aspect-ratio: 9/16; max-height: 50vh; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
          .preview-img { width: 100%; height: 100%; object-fit: cover; }

          .text-container { width: 100%; text-align: center; padding-top: 30px; }

          .download-btn {
            width: 100%; padding: 22px; border-radius: 24px; border: none;
            font-size: 16px; font-weight: 900; margin-top: 25px; cursor: pointer;
            transition: transform 0.2s ease;
          }
          .download-btn:active { transform: scale(0.97); }

          /* ANIMATIONS */
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideDown { from { transform: translateY(-100px) translateX(-50%); opacity: 0; } to { transform: translateY(0) translateX(-50%); opacity: 1; } }
          @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .loader-vibe { font-size: 28px; font-weight: 900; letter-spacing: -1.5px; animation: pulse 2s infinite ease-in-out; }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } }
        `}</style>
      </main>
    </div>
  );
}