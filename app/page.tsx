'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function IVibeProFullInteractive() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const fetchWps = async () => {
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
  }, []);

  const download = async (url: string, name: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.png`;
    link.click();
  };

  // Lógica de filtrado
  const filtered = wallpapers.filter(wp => 
    wp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'Trending' || wp.category === category)
  );

  // Wallpapers recomendados (los primeros 4 con tag premium o random)
  const recommended = wallpapers.slice(0, 4);

  if (loading) return <div className="loader">iVibe PRO</div>;

  return (
    <div className="main-viewport">
      <header className="premium-header">
        <div className="top-nav">
          <div className="user-pill" onClick={() => alert('Profile coming soon!')}><div className="avatar" /></div>
          <div className="search-bar-wrapper">
             <input 
               type="text" 
               placeholder="Search wallpapers..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* SECCIÓN RECOMENDADOS (Horizontal) */}
        <div className="section-label">Recommended for you</div>
        <div className="recommended-slider">
          {recommended.map((wp) => (
            <div key={`rec-${wp.id}`} className="rec-card" onClick={() => setSelected(wp)}>
              <img src={wp.irl} alt="" />
              <div className="rec-overlay">
                <span>{wp.name}</span>
                <p>Ultra HD</p>
              </div>
            </div>
          ))}
        </div>

        <nav className="category-nav">
          {['Trending', 'ForYou', 'Premium'].map(cat => (
            <button 
              key={cat} 
              className={category === cat ? 'active' : ''} 
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </header>

      <main className="wallpaper-grid">
        {filtered.map((wp, i) => (
          <div key={wp.id} className="wp-item" onClick={() => setSelected(wp)} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="image-container">
              <img src={wp.irl} alt={wp.name} loading="lazy" />
              {wp.premium && <div className="premium-tag">💎</div>}
            </div>
            <div className="wp-details">
              <h4>{wp.name}</h4>
              <p>OLED Optimized | 2.4 MB</p>
            </div>
          </div>
        ))}
      </main>

      {/* BANNER DINÁMICO (Captura 2) */}
      {selected && (
        <div className="modal-root">
          <div className="overlay-blur" onClick={() => setSelected(null)} />
          <div className="premium-banner">
            <div className="drag-handle" onClick={() => setSelected(null)} />
            <div className="banner-image">
              <img src={selected.irl} alt="Preview" />
            </div>
            <div className="banner-info">
              <h2>{selected.name}</h2>
              <div className="tags">
                <span className="tag-pill">8K RESOLUTION</span>
                <span className="tag-pill">LIQUID GLASS</span>
              </div>
              <button className="download-cta" onClick={() => download(selected.irl, selected.name)}>
                DOWNLOAD NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCK INTERACTIVO */}
      <footer className="floating-dock">
        {[
          { icon: '🏠', label: 'Home' },
          { icon: '📋', label: 'Setup' },
          { icon: '❤️', label: 'Favorite' },
          { icon: '📱', label: 'Mockup' }
        ].map((item) => (
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
        :root { --blue: #007AFF; --glass: rgba(255,255,255,0.08); --accent: #50E3C2; }
        body { margin: 0; background: #000; font-family: 'Plus Jakarta Sans', sans-serif; color: white; overflow-x: hidden; }

        /* HEADER & SEARCH */
        .premium-header { padding: 40px 20px 10px; }
        .top-nav { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; }
        .search-bar-wrapper { flex: 1; position: relative; background: #111; border-radius: 20px; padding: 2px 15px; border: 1px solid #222; }
        .search-bar-wrapper input { background: transparent; border: none; color: white; padding: 10px 0; width: 90%; outline: none; font-size: 14px; }
        .search-icon { position: absolute; right: 15px; top: 10px; opacity: 0.5; }

        /* RECOMMENDED SLIDER */
        .section-label { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--blue); margin-bottom: 15px; }
        .recommended-slider { display: flex; gap: 15px; overflow-x: auto; scrollbar-width: none; padding-bottom: 10px; }
        .rec-card { min-width: 140px; height: 190px; border-radius: 25px; overflow: hidden; position: relative; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; }
        .rec-card:active { transform: scale(0.95); }
        .rec-card img { width: 100%; height: 100%; object-fit: cover; }
        .rec-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 12px; }
        .rec-overlay span { font-size: 11px; font-weight: 800; }
        .rec-overlay p { font-size: 9px; opacity: 0.6; margin: 2px 0 0; }

        /* CATEGORY NAV */
        .category-nav { display: flex; background: #111; border-radius: 30px; padding: 4px; margin-top: 15px; }
        .category-nav button { flex: 1; border: none; background: transparent; color: #555; padding: 10px; font-weight: 800; border-radius: 25px; transition: 0.3s; cursor: pointer; }
        .category-nav button.active { background: #222; color: white; }

        /* GRID */
        .wallpaper-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px 20px 140px; }
        .wp-item { animation: fadeInUp 0.5s ease forwards; opacity: 0; cursor: pointer; }
        .image-container { border-radius: 28px; overflow: hidden; height: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); }
        .image-container img { width: 100%; height: 100%; object-fit: cover; }
        .wp-details h4 { margin: 8px 0 0; font-size: 14px; font-weight: 800; letter-spacing: -0.5px; }
        .wp-details p { margin: 3px 0 0; font-size: 9px; opacity: 0.4; font-weight: 600; }

        /* MODAL BANNER (FOTO 2) */
        .modal-root { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: flex-end; }
        .overlay-blur { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); }
        .premium-banner { 
          width: 100%; background: #080808; border-radius: 45px 45px 0 0; position: relative; 
          padding: 20px; animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          border-top: 1px solid #222;
        }
        .banner-image { width: 100%; height: 420px; border-radius: 35px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.9); }
        .banner-image img { width: 100%; height: 100%; object-fit: cover; }
        .banner-info { padding: 30px 15px; text-align: center; }
        .banner-info h2 { font-size: 26px; font-weight: 900; margin: 0 0 15px; letter-spacing: -1px; }
        .tag-pill { background: rgba(0,122,255,0.15); color: var(--blue); padding: 5px 15px; border-radius: 12px; font-size: 9px; font-weight: 900; border: 1px solid rgba(0,122,255,0.2); margin: 0 5px; }
        .download-cta { width: 100%; padding: 22px; border-radius: 25px; border: none; background: var(--blue); color: white; font-weight: 900; font-size: 16px; margin-top: 30px; box-shadow: 0 15px 35px rgba(0, 122, 255, 0.4); cursor: pointer; }

        /* DOCK */
        .floating-dock { 
          position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%);
          width: 85%; max-width: 380px; background: rgba(20,20,20,0.7);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 35px; padding: 12px 10px;
          display: flex; justify-content: space-around; align-items: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .dock-item { display: flex; flex-direction: column; align-items: center; opacity: 0.4; transition: 0.4s cubic-bezier(0.2, 1, 0.3, 1); cursor: pointer; }
        .dock-item.active { opacity: 1; transform: translateY(-5px); }
        .dock-item .icon { font-size: 22px; }
        .dock-item .label { font-size: 9px; font-weight: 800; margin-top: 4px; color: var(--accent); }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 2rem; color: var(--blue); }
      `}</style>
    </div>
  );
}