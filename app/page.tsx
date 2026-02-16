'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function IVibeProPremium() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [favorites, setFavorites] = useState<number[]>([]);

  // Configuración de navegación
  const categories = ['Trending', 'Anime', 'Minimal', 'Premium'];
  const dockItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '📋', label: 'Setup' },
    { icon: '❤️', label: 'Favorite' },
    { icon: '📱', label: 'Mockup' }
  ];

  // Índices para las gotas de cristal
  const activeDockIndex = dockItems.findIndex(item => item.label === activeTab);
  const activeCategoryIndex = categories.indexOf(category);

  useEffect(() => {
    const fetchWps = async () => {
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
    const savedFavs = localStorage.getItem('ivibe_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    let newFavs = [...favorites];
    if (newFavs.includes(id)) {
      newFavs = newFavs.filter(favId => favId !== id);
    } else {
      newFavs.push(id);
    }
    setFavorites(newFavs);
    localStorage.setItem('ivibe_favs', JSON.stringify(newFavs));
  };

  const download = async (url: string, name: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.png`;
    link.click();
  };

  const getFilteredData = () => {
    let base = wallpapers;
    if (activeTab === 'Favorite') {
      base = wallpapers.filter(wp => favorites.includes(wp.id));
    } else if (activeTab === 'Setup') {
      base = wallpapers.filter(wp => wp.category === 'Setup');
    } else if (activeTab === 'Mockup') {
      base = wallpapers.filter(wp => wp.category === 'Mockup');
    } else {
      if (category !== 'Trending') {
        base = wallpapers.filter(wp => wp.category === category);
      }
    }
    return base.filter(wp => wp.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const filtered = getFilteredData();
  const recommended = wallpapers.slice(0, 5);

  if (loading) return <div className="loader">iVibe PRO</div>;

  return (
    <div className="main-viewport">
      <header className="premium-header">
        <div className="top-nav glass">
          <div className="avatar" />
          <div className="search-bar">
             <input 
               type="text" 
               placeholder="Search inspiration..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <span className="search-icon">🔍</span>
          </div>
        </div>

        {activeTab === 'Home' && (
          <>
            <div className="section-label">Featured Art</div>
            <div className="recommended-slider">
              {recommended.map((wp) => (
                <div key={`rec-${wp.id}`} className="rec-card glass" onClick={() => setSelected(wp)}>
                  <img src={wp.irl} alt="" />
                  <div className="rec-overlay">
                    <span>{wp.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CATEGORÍAS CON GOTA DE CRISTAL */}
            <nav className="category-nav glass">
              <div 
                className="category-drop" 
                style={{ transform: `translateX(calc(${activeCategoryIndex} * 100%))` }}
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
          </>
        )}
      </header>

      <main className="wallpaper-grid">
        <div className="grid-header">
           <h2>{activeTab} Collection</h2>
           <p>{filtered.length} Wallpapers found</p>
        </div>
        <div className="grid-layout">
            {filtered.map((wp) => (
            <div key={wp.id} className="wp-item" onClick={() => setSelected(wp)}>
                <div className="image-container glass">
                <img src={wp.irl} alt={wp.name} loading="lazy" />
                <button className={`fav-btn ${favorites.includes(wp.id) ? 'is-fav' : ''}`} onClick={(e) => toggleFavorite(e, wp.id)}>
                    ❤️
                </button>
                {wp.premium && <div className="premium-tag">💎</div>}
                </div>
                <div className="wp-details">
                <h4>{wp.name}</h4>
                </div>
            </div>
            ))}
        </div>
      </main>

      {/* DOCK CON GOTA DE CRISTAL */}
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
        :root { 
            --blue: #007AFF; 
            --glass: rgba(255, 255, 255, 0.04); 
            --glass-border: rgba(255, 255, 255, 0.1);
            --drop-bg: rgba(255, 255, 255, 0.12);
        }
        
        body { margin: 0; background: #000; font-family: 'Plus Jakarta Sans', sans-serif; color: white; overflow-x: hidden; }

        .glass {
            background: var(--glass);
            backdrop-filter: blur(30px) saturate(160%);
            -webkit-backdrop-filter: blur(30px) saturate(160%);
            border: 1px solid var(--glass-border);
        }

        .premium-header { padding: 50px 20px 20px; }
        .top-nav { display: flex; gap: 15px; align-items: center; padding: 12px 18px; border-radius: 25px; margin-bottom: 25px; }

        /* CATEGORY NAV CON GOTA */
        .category-nav { 
            display: flex; position: relative; border-radius: 20px; padding: 5px; margin-top: 20px; 
            overflow: hidden;
        }
        .category-drop {
            position: absolute; top: 5px; left: 5px;
            width: calc((100% - 10px) / 4); height: calc(100% - 10px);
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            z-index: 0;
            transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .category-nav button { 
            flex: 1; border: none; background: transparent; color: rgba(255,255,255,0.4); 
            padding: 12px; font-weight: 800; font-size: 12px; position: relative; z-index: 1;
            transition: 0.3s;
        }
        .category-nav button.active { color: white; }

        /* WALLPAPER GRID */
        .wallpaper-grid { padding: 10px 20px 150px; }
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .image-container { border-radius: 32px; overflow: hidden; height: 280px; position: relative; }
        .image-container img { width: 100%; height: 100%; object-fit: cover; }

        /* DOCK CON GOTA */
        .floating-dock { 
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            width: 90%; max-width: 380px; height: 75px; border-radius: 35px; 
            display: flex; justify-content: space-around; align-items: center;
            z-index: 1000; padding: 0 10px;
        }
        .dock-drop {
            position: absolute; top: 10px; left: 10px;
            width: calc((100% - 20px) / 4); height: 55px;
            background: var(--drop-bg);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            z-index: -1;
            transition: transform 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .dock-item { width: 25%; display: flex; flex-direction: column; align-items: center; z-index: 2; transition: 0.3s; }
        .dock-item.active { transform: translateY(-2px); }
        .dock-item .label { font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.4); margin-top: 4px; }
        .dock-item.active .label { color: white; }

        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; background: black; }
      `}</style>
    </div>
  );
}