'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function IVibeProLiquid() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Trending');
  const [activeTab, setActiveTab] = useState('Home');
  const [selected, setSelected] = useState<any | null>(null);

  const categories = ['Trending', 'Anime', 'Minimal', 'Premium'];
  const dockItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '💻', label: 'Setup' },
    { icon: '❤️', label: 'Favorite' },
    { icon: '🎨', label: 'Mockup' }
  ];

  useEffect(() => {
    const fetchWps = async () => {
      // Nota: Usamos 'irl' porque confirmamos que así se llama tu columna
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
  }, []);

  const handleDownload = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name}_iVibe.png`;
      link.click();
    } catch (err) {
      alert("Error al descargar. Mantén presionada la imagen.");
    }
  };

  const filtered = wallpapers.filter(wp => {
    if (activeTab === 'Setup') return wp.category === 'Setup';
    if (activeTab === 'Mockup') return wp.category === 'Mockup';
    if (category === 'Trending') return true;
    return wp.category === category;
  });

  if (loading) return (
    <div className="loader">
      <div className="ios-spinner"></div>
      <span>iVibe PRO</span>
    </div>
  );

  return (
    <div className="main-viewport">
      {/* Fondo con movimiento tipo Mesh Gradient */}
      <div className="mesh-bg"></div>

      <header className="ios-header">
        <div className="status-bar">
          <div className="avatar-ring">
             <div className="avatar-inner" />
          </div>
          <h1 className="brand-title">iVibe <span>PRO</span></h1>
          <div className="premium-badge">􀝊</div>
        </div>

        {activeTab === 'Home' && (
          <div className="category-scroller">
            <nav className="liquid-nav glass">
              <div 
                className="nav-indicator" 
                style={{ transform: `translateX(calc(${categories.indexOf(category)} * 100%))` }}
              />
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={category === cat ? 'active' : ''} 
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="content-scroll">
        <div className="grid-layout">
          {filtered.map((wp) => (
            <div key={wp.id} className="wp-card" onClick={() => setSelected(wp)}>
              <div className="wp-wrapper glass-border">
                <img src={wp.irl} alt={wp.name} loading="lazy" />
                {wp.premium && <div className="tag-premium">􀝊 PREMIUM</div>}
                <div className="wp-overlay">
                  <span>{wp.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* DETALLE (MODAL) TIPO IOS SHEET */}
      {selected && (
        <div className="modal-root">
          <div className="overlay-blur" onClick={() => setSelected(null)} />
          <div className="sheet glass">
            <div className="drag-handle" />
            <div className="preview-hero">
              <img src={selected.irl} alt="Preview" />
              <button className="close-x" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="sheet-content">
              <h2>{selected.name}</h2>
              <p>OLED Optimized • 4K HDR</p>
              <button className="btn-apple" onClick={() => handleDownload(selected.irl, selected.name)}>
                Get Wallpaper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCK LIQUIDO */}
      <footer className="dock-container">
        <div className="dock glass">
          <div 
            className="dock-selector" 
            style={{ transform: `translateX(calc(${dockItems.findIndex(i => i.label === activeTab)} * 100%))` }}
          />
          {dockItems.map((item) => (
            <div 
              key={item.label} 
              className={`dock-item ${activeTab === item.label ? 'active' : ''}`}
              onClick={() => setActiveTab(item.label)}
            >
              <span className="dock-icon">{item.icon}</span>
              <span className="dock-label">{item.label}</span>
            </div>
          ))}
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        :root { 
          --blue: #0A84FF; 
          --glass: rgba(20, 20, 20, 0.7);
          --border: rgba(255, 255, 255, 0.15);
          --radius: 32px;
        }

        body { 
          margin: 0; 
          background: #000; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: white; 
          overflow: hidden; 
        }

        /* MESH BACKGROUND */
        .mesh-bg {
          position: fixed;
          top: -50%; left: -50%; width: 200%; height: 200%;
          z-index: -1;
          background: radial-gradient(circle at 70% 30%, #1a1a2e 0%, #000 50%),
                      radial-gradient(circle at 20% 70%, #0a1128 0%, #000 50%);
          opacity: 0.6;
        }

        /* GLASS EFFECT */
        .glass { 
          background: var(--glass); 
          backdrop-filter: blur(35px) saturate(180%);
          -webkit-backdrop-filter: blur(35px) saturate(180%);
          border: 0.5px solid var(--border);
        }

        /* HEADER */
        .ios-header { padding: 50px 20px 15px; position: sticky; top: 0; z-index: 1000; background: rgba(0,0,0,0.4); }
        .status-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .brand-title { font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -1px; }
        .brand-title span { color: var(--blue); }
        .avatar-ring { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #0A84FF, #5AC8FA); padding: 2px; }
        .avatar-inner { width: 100%; height: 100%; background: #000; border-radius: 50%; }

        /* LIQUID NAV */
        .liquid-nav { display: flex; position: relative; border-radius: 18px; padding: 4px; gap: 4px; }
        .nav-indicator { position: absolute; top: 4px; left: 4px; width: calc((100% - 20px) / 4); height: calc(100% - 8px); background: rgba(255,255,255,0.15); border-radius: 14px; transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        .liquid-nav button { flex: 1; border: none; background: transparent; color: #888; padding: 12px; font-weight: 600; font-size: 13px; z-index: 1; transition: 0.3s; }
        .liquid-nav button.active { color: white; }

        /* CONTENT */
        .content-scroll { height: 100vh; overflow-y: scroll; padding: 0 16px 200px; scroll-behavior: smooth; }
        .grid-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .wp-wrapper { border-radius: 28px; aspect-ratio: 9/16; overflow: hidden; position: relative; border: 0.5px solid rgba(255,255,255,0.1); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .wp-card:active .wp-wrapper { transform: scale(0.92) rotate(1deg); }
        .wp-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .wp-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 15px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); }
        .wp-overlay span { font-size: 12px; font-weight: 500; opacity: 0.8; }
        .tag-premium { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 8px; font-size: 9px; font-weight: 800; color: #FFD700; backdrop-filter: blur(5px); }

        /* DOCK LIQUID */
        .dock-container { position: fixed; bottom: 34px; left: 0; right: 0; display: flex; justify-content: center; z-index: 2000; }
        .dock { width: 90%; max-width: 360px; height: 72px; border-radius: 35px; display: flex; padding: 6px; position: relative; }
        .dock-selector { position: absolute; top: 6px; left: 6px; width: calc((100% - 12px) / 4); height: calc(100% - 12px); background: rgba(255,255,255,0.1); border-radius: 29px; transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1); }
        .dock-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; opacity: 0.5; transition: 0.4s; }
        .dock-item.active { opacity: 1; transform: translateY(-4px); }
        .dock-icon { font-size: 20px; }
        .dock-label { font-size: 10px; font-weight: 700; margin-top: 4px; }

        /* MODAL SHEET */
        .sheet { position: fixed; bottom: 0; left: 0; right: 0; height: 85vh; border-radius: 40px 40px 0 0; z-index: 3000; display: flex; flex-direction: column; animation: sheetUp 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        .drag-handle { width: 40px; height: 5px; background: rgba(255,255,255,0.2); border-radius: 10px; margin: 12px auto; }
        .preview-hero { flex: 1; margin: 0 15px; border-radius: 30px; overflow: hidden; position: relative; }
        .preview-hero img { width: 100%; height: 100%; object-fit: cover; }
        .sheet-content { padding: 30px; text-align: center; }
        .btn-apple { width: 100%; padding: 20px; border-radius: 22px; background: white; color: black; border: none; font-size: 17px; font-weight: 700; transition: 0.3s; }
        .btn-apple:active { transform: scale(0.96); background: rgba(255,255,255,0.9); }

        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .loader { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
        .ios-spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}