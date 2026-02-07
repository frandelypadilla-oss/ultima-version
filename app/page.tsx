'use client';
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabase';

export default function IVibeProOptimized() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWps = async () => {
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
  }, []);

  // FUNCIÓN PARA NAVEGAR FLUIDAMENTE A UN WP ALEATORIO
  const scrollToRandom = () => {
    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      const randomWp = filtered[randomIndex];
      
      // Buscamos el elemento en el DOM
      const element = document.getElementById(`wp-${randomWp.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedId(randomWp.id);
        // Quitamos el brillo después de 1.5 segundos
        setTimeout(() => setHighlightedId(null), 1500);
      }
    }
  };

  const download = async (url: string, name: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.png`;
    link.click();
  };

  const filtered = wallpapers.filter(wp => 
    wp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'Trending' || wp.category === category)
  );

  const recommended = wallpapers.slice(0, 4);

  if (loading) return <div className="loader">iVibe PRO</div>;

  return (
    <div className="main-viewport">
      <header className="premium-header">
        <div className="top-nav">
          <div className="user-pill"><div className="avatar" /></div>
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

        <div className="section-label">Recommended for you</div>
        <div className="recommended-slider">
          {recommended.map((wp, i) => (
            <div key={`rec-${wp.id}`} className="rec-card" onClick={() => setSelected(wp)}>
              <img src={wp.irl} alt="" fetchPriority={i < 2 ? "high" : "auto"} />
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
          <div 
            id={`wp-${wp.id}`}
            key={wp.id} 
            className={`wp-item ${highlightedId === wp.id ? 'highlight-pulse' : ''}`} 
            onClick={() => setSelected(wp)} 
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <div className="image-container">
              <img src={wp.irl} alt={wp.name} loading="lazy" decoding="async" />
              {wp.premium && <div className="premium-tag">💎</div>}
            </div>
            <div className="wp-details">
              <h4>{wp.name}</h4>
              <p>OLED Optimized</p>
            </div>
          </div>
        ))}
      </main>

      {/* MODAL (Solo se abre si el usuario hace click manual) */}
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
              <button className="download-cta" onClick={() => download(selected.irl, selected.name)}>
                DOWNLOAD NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCK INTERACTIVO SIN CAMBIO DE PLANO */}
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
            onClick={() => {
              setActiveTab(item.label);
              scrollToRandom(); // <--- Desplazamiento suave, no invasivo
            }}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </footer>

      <style jsx global>{`
        :root { --blue: #007AFF; --glass: rgba(255,255,255,0.08); --accent: #50E3C2; }
        body { margin: 0; background: #000; font-family: 'Plus Jakarta Sans', sans-serif; color: white; overflow-x: hidden; }

        .image-container { background: #111; position: relative; }
        
        /* EFECTO DE RESALTE AL SELECCIONAR ALEATORIO */
        .highlight-pulse {
          transform: scale(1.05);
          z-index: 10;
          transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .highlight-pulse .image-container {
          outline: 3px solid var(--accent);
          box-shadow: 0 0 30px var(--accent);
        }

        .premium-header { padding: 40px 20px 10px; }
        .top-nav { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; }
        .search-bar-wrapper { flex: 1; position: relative; background: #111; border-radius: 20px; padding: 2px 15px; border: 1px solid #222; }
        .search-bar-wrapper input { background: transparent; border: none; color: white; padding: 10px 0; width: 90%; outline: none; }

        .section-label { font-size: 13px; font-weight: 800; text-transform: uppercase; color: var(--blue); margin-bottom: 15px; }
        .recommended-slider { display: flex; gap: 15px; overflow-x: auto; scrollbar-width: none; padding-bottom: 10px; }
        .rec-card { min-width: 140px; height: 190px; border-radius: 25px; overflow: hidden; position: relative; flex-shrink: 0; }
        .rec-card img { width: 100%; height: 100%; object-fit: cover; }

        .category-nav { display: flex; background: #111; border-radius: 30px; padding: 4px; margin-top: 15px; }
        .category-nav button { flex: 1; border: none; background: transparent; color: #555; padding: 10px; font-weight: 800; border-radius: 25px; }
        .category-nav button.active { background: #222; color: white; }

        .wallpaper-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px 20px 140px; }
        .wp-item { animation: fadeInUp 0.4s ease forwards; transition: 0.3s; }
        .image-container { border-radius: 28px; overflow: hidden; height: 260px; border: 1px solid rgba(255,255,255,0.05); }
        .image-container img { width: 100%; height: 100%; object-fit: cover; }
        .wp-details h4 { margin: 8px 0 0; font-size: 13px; font-weight: 800; }

        .modal-root { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: flex-end; }
        .overlay-blur { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); }
        .premium-banner { width: 100%; background: #080808; border-radius: 40px 40px 0 0; position: relative; padding: 20px; border-top: 1px solid #222; }
        .banner-image { width: 100%; height: 380px; border-radius: 30px; overflow: hidden; }
        .banner-image img { width: 100%; height: 100%; object-fit: cover; }
        .download-cta { width: 100%; padding: 20px; border-radius: 20px; border: none; background: var(--blue); color: white; font-weight: 900; margin-top: 20px; }

        .floating-dock { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 85%; background: rgba(20,20,20,0.8); backdrop-filter: blur(30px); border-radius: 35px; padding: 12px; display: flex; justify-content: space-around; border: 1px solid rgba(255,255,255,0.08); z-index: 100; }
        .dock-item { display: flex; flex-direction: column; align-items: center; opacity: 0.4; transition: 0.3s; }
        .dock-item.active { opacity: 1; transform: translateY(-3px); }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; background: #000; color: var(--blue); }
      `}</style>
    </div>
  );
}