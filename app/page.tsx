'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function IVibeProComplete() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Trending');
  const [activeTab, setActiveTab] = useState('Home');
  const [selected, setSelected] = useState<any | null>(null); // ESTADO PARA EL BANNER

  const categories = ['Trending', 'Anime', 'Minimal', 'Premium'];
  const dockItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '📋', label: 'Setup' },
    { icon: '❤️', label: 'Favorite' },
    { icon: '📱', label: 'Mockup' }
  ];

  const activeDockIndex = dockItems.findIndex(item => item.label === activeTab);
  const activeCategoryIndex = categories.indexOf(category);

  useEffect(() => {
    const fetchWps = async () => {
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
  }, []);

  // FUNCIÓN DE DESCARGA REAL
  const handleDownload = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name.replace(/\s+/g, '_')}_iVibe.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Error al descargar. Intenta dejar presionado sobre la imagen.");
    }
  };

  const getFilteredData = () => {
    let base = wallpapers;
    if (activeTab === 'Setup') base = wallpapers.filter(wp => wp.category === 'Setup');
    else if (activeTab === 'Mockup') base = wallpapers.filter(wp => wp.category === 'Mockup');
    else if (category !== 'Trending') base = wallpapers.filter(wp => wp.category === category);
    return base;
  };

  const filtered = getFilteredData();

  if (loading) return <div className="loader">iVibe PRO</div>;

  return (
    <div className="main-viewport">
      <header className="premium-header">
        <div className="top-nav glass">
          <div className="avatar" />
          <div className="search-bar">iVibe PRO</div>
        </div>

        {activeTab === 'Home' && (
          <nav className="category-nav glass">
            <div 
              className="category-drop" 
              style={{ transform: `translateX(calc(${activeCategoryIndex} * 100%))` }}
            />
            {categories.map(cat => (
              <button key={cat} className={category === cat ? 'active' : ''} onClick={() => setCategory(cat)}>
                {cat}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="content-scroll">
        <div className="grid-layout">
            {filtered.map((wp) => (
            <div key={wp.id} className="wp-card" onClick={() => setSelected(wp)}>
                <div className="wp-wrapper glass">
                    <img src={wp.irl} alt={wp.name} loading="lazy" />
                    {wp.premium && <div className="tag-premium">💎</div>}
                    <div className="wp-info">
                        <span>{wp.name}</span>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </main>

      {/* BANNER DE DESCARGA (MODAL) */}
      {selected && (
        <div className="modal-root">
          <div className="overlay-blur" onClick={() => setSelected(null)} />
          <div className="download-card glass">
            <div className="preview-container">
              <img src={selected.irl} alt="Preview" />
              <button className="close-btn glass" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="download-footer">
              <div className="info">
                <h3>{selected.name}</h3>
                <p>Ultra HD • OLED Optimized</p>
              </div>
              <button className="btn-main" onClick={() => handleDownload(selected.irl, selected.name)}>
                DOWNLOAD 
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCK INFERIOR */}
      <footer className="floating-dock glass">
        <div 
          className="dock-drop" 
          style={{ transform: `translateX(calc(${activeDockIndex} * 100%))` }}
        />
        {dockItems.map((item) => (
          <div 
            key={item.label} 
            className={`dock-item ${activeTab === item.label ? 'active' : ''}`}
            onClick={() => setActiveTab(item.label)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </footer>

      <style jsx global>{`
        :root { --blue: #007AFF; --glass: rgba(255,255,255,0.06); --border: rgba(255,255,255,0.1); }
        body { margin: 0; background: #000; font-family: 'Plus Jakarta Sans', sans-serif; color: white; overflow: hidden; }

        .glass { background: var(--glass); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid var(--border); }

        .premium-header { padding: 40px 20px 10px; position: sticky; top: 0; z-index: 100; background: black; }
        .top-nav { display: flex; align-items: center; gap: 15px; padding: 10px 15px; border-radius: 20px; }
        .avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(var(--blue), #50E3C2); }
        .search-bar { font-weight: 900; font-size: 18px; }

        .category-nav { display: flex; position: relative; border-radius: 15px; padding: 4px; margin-top: 15px; }
        .category-drop { position: absolute; top: 4px; left: 4px; width: calc((100% - 8px) / 4); height: calc(100% - 8px); background: rgba(255,255,255,0.12); border-radius: 12px; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: 0.5px solid rgba(255,255,255,0.2); }
        .category-nav button { flex: 1; border: none; background: transparent; color: #666; padding: 10px; font-weight: 700; font-size: 11px; position: relative; z-index: 1; transition: 0.3s; }
        .category-nav button.active { color: white; }

        .content-scroll { height: 100vh; overflow-y: auto; padding: 0 15px 180px; }
        .grid-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding-top: 10px; }
        .wp-card { width: 100%; aspect-ratio: 9 / 16; cursor: pointer; }
        .wp-wrapper { width: 100%; height: 100%; border-radius: 24px; overflow: hidden; position: relative; transition: 0.3s; }
        .wp-wrapper:active { transform: scale(0.96); }
        .wp-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .wp-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 15px 10px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
        .wp-info span { font-size: 10px; font-weight: 600; opacity: 0.7; display: block; }

        /* MODAL DE DESCARGA */
        .modal-root { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .overlay-blur { position: absolute; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); }
        .download-card { width: 100%; max-width: 400px; border-radius: 35px; padding: 15px; position: relative; animation: slideUp 0.4s ease-out; }
        .preview-container { width: 100%; height: 450px; border-radius: 25px; overflow: hidden; position: relative; }
        .preview-container img { width: 100%; height: 100%; object-fit: cover; }
        .close-btn { position: absolute; top: 15px; right: 15px; width: 40px; height: 40px; border-radius: 50%; border: none; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        
        .download-footer { padding: 20px 10px 10px; text-align: center; }
        .download-footer h3 { margin: 0; font-size: 20px; }
        .download-footer p { margin: 5px 0 20px; font-size: 12px; color: #888; }
        .btn-main { width: 100%; padding: 20px; border-radius: 20px; border: none; background: white; color: black; font-weight: 900; font-size: 16px; cursor: pointer; transition: 0.2s; }
        .btn-main:active { transform: scale(0.98); background: #eee; }

        /* DOCK */
        .floating-dock { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 85%; max-width: 350px; height: 65px; border-radius: 30px; display: flex; justify-content: space-around; align-items: center; z-index: 1000; }
        .dock-drop { position: absolute; top: 6px; left: 6px; width: calc((100% - 12px) / 4); height: calc(100% - 12px); background: rgba(255,255,255,0.12); border-radius: 24px; transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); border: 0.5px solid rgba(255,255,255,0.2); }
        .dock-item { width: 25%; display: flex; flex-direction: column; align-items: center; z-index: 2; opacity: 0.4; transition: 0.3s; cursor: pointer; }
        .dock-item.active { opacity: 1; transform: translateY(-2px); }
        .dock-item .label { font-size: 9px; font-weight: 800; margin-top: 2px; }

        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; background: #000; }
      `}</style>
    </div>
  );
}