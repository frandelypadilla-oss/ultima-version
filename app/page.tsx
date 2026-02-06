'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function IVibeProBotEdition() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [botMessage, setBotMessage] = useState('¡Dime qué buscamos hoy, jefe!');
  const [isBotDancing, setIsBotDancing] = useState(false);

  const frases = [
    "¡Ese wallpaper está más duro que un cuarto de pollo!",
    "Buscando... espero que tengas buen gusto. 👀",
    "¡Klpk! ¿Le damos un refresh al cel?",
    "Si fuera humano, me bajaría ese mismo.",
    "¿Buscando algo premium? Estás en el lugar indicado.",
    "Cuidado, que ese fondo brilla más que el sol de mediodía."
  ];

  useEffect(() => {
    const fetchWps = async () => {
      const { data } = await supabase.from('wallpapers').select('*');
      if (data) setWallpapers(data);
      setLoading(false);
    };
    fetchWps();
  }, []);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      setBotMessage("¡Uff, buena elección!");
      setIsBotDancing(true);
      setTimeout(() => setIsBotDancing(false), 500);
    }
  };

  const interactBot = () => {
    const random = frases[Math.floor(Math.random() * frases.length)];
    setBotMessage(random);
    setIsBotDancing(true);
    setTimeout(() => setIsBotDancing(false), 600);
  };

  if (loading) return <div className="loader">iVibe PRO</div>;

  return (
    <div className="main-viewport">
      
      {/* SECCIÓN DEL ROBOT DIVERTIDO */}
      <div className="bot-section" onClick={interactBot}>
        <div className={`robot-container ${isBotDancing ? 'dance' : ''}`}>
          <div className="speech-bubble">{botMessage}</div>
          <svg width="60" height="60" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="45" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="0.5" />
             <rect x="30" y="40" width="40" height="20" rx="10" fill="#121212" />
             <circle cx="40" cy="50" r="4" fill="#00F0FF"><animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/></circle>
             <circle cx="60" cy="50" r="4" fill="#00F0FF"><animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/></circle>
             <path d="M45 70 Q50 75 55 70" stroke="#00F0FF" fill="none" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <header className="premium-header">
        <div className="search-bar-wrapper">
           <input type="text" placeholder="Busca tu estilo..." value={searchTerm} onChange={handleSearch} />
           <span className="search-icon">🔍</span>
        </div>
        
        <div className="section-label">Recomendados 🔥</div>
        <div className="recommended-slider">
          {wallpapers.slice(0, 4).map((wp) => (
            <div key={`rec-${wp.id}`} className="rec-card" onClick={() => setSelected(wp)}>
              <img src={wp.irl} alt="" />
              <div className="rec-overlay"><span>{wp.name}</span></div>
            </div>
          ))}
        </div>
      </header>

      <main className="wallpaper-grid">
        {wallpapers.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase())).map((wp, i) => (
          <div key={wp.id} className="wp-item" onClick={() => setSelected(wp)} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="image-container">
              <img src={wp.irl} alt={wp.name} />
            </div>
            <div className="wp-details">
              <h4>{wp.name}</h4>
              <p>OLED Optimized • 8K</p>
            </div>
          </div>
        ))}
      </main>

      {/* BANNER QUE SUBE (EL DE TU FOTO) */}
      {selected && (
        <div className="modal-root">
          <div className="overlay-blur" onClick={() => setSelected(null)} />
          <div className="premium-banner">
            <div className="drag-handle" />
            <div className="banner-image"><img src={selected.irl} alt="" /></div>
            <div className="banner-info">
              <h2>{selected.name}</h2>
              <div className="tags"><span className="tag-pill">PREMIUM ASSET</span></div>
              <button className="download-cta" onClick={() => window.open(selected.irl)}>DOWNLOAD NOW</button>
            </div>
          </div>
        </div>
      )}

      {/* DOCK INFERIOR INTERACTIVO */}
      <footer className="floating-dock">
        {['Home', 'Setup', 'Favorite', 'Mockup'].map((tab) => (
          <div key={tab} className={`dock-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            <span className="label">{tab}</span>
          </div>
        ))}
      </footer>

      <style jsx global>{`
        body { margin: 0; background: #000; font-family: 'Plus Jakarta Sans', sans-serif; color: white; overflow-x: hidden; }
        .main-viewport { padding-top: 20px; }
        
        /* ROBOT STYLES */
        .bot-section { display: flex; justify-content: center; margin-bottom: 10px; cursor: pointer; }
        .robot-container { position: relative; display: flex; flex-direction: column; align-items: center; }
        .speech-bubble { 
          background: white; color: black; padding: 8px 15px; border-radius: 15px; 
          font-size: 11px; font-weight: 800; margin-bottom: 10px; position: relative;
          box-shadow: 0 5px 15px rgba(255,255,255,0.2);
          animation: bounce 2s infinite;
        }
        .speech-bubble::after { 
          content: ''; position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
          border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid white;
        }
        .dance { animation: dance 0.5s ease; }
        @keyframes dance { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1) rotate(10deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        /* HEADER & GRID */
        .premium-header { padding: 0 20px; }
        .search-bar-wrapper { background: #111; border-radius: 20px; padding: 12px 20px; display: flex; align-items: center; border: 1px solid #222; }
        .search-bar-wrapper input { background: transparent; border: none; color: white; flex: 1; outline: none; }
        
        .recommended-slider { display: flex; gap: 15px; overflow-x: auto; scrollbar-width: none; padding: 10px 0; }
        .rec-card { min-width: 120px; height: 160px; border-radius: 20px; overflow: hidden; position: relative; border: 1px solid #222; }
        .rec-card img { width: 100%; height: 100%; object-fit: cover; }
        .rec-overlay { position: absolute; bottom: 0; width: 100%; background: linear-gradient(transparent, black); padding: 10px; font-size: 10px; font-weight: 800; }

        .wallpaper-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px; padding-bottom: 120px; }
        .image-container { height: 260px; border-radius: 25px; overflow: hidden; border: 1px solid #222; }
        .image-container img { width: 100%; height: 100%; object-fit: cover; }
        .wp-details h4 { margin: 8px 0 0; font-size: 13px; }
        .wp-details p { margin: 2px 0 0; font-size: 9px; opacity: 0.5; }

        /* MODAL (FOTO 2) */
        .modal-root { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: flex-end; }
        .overlay-blur { position: absolute; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); }
        .premium-banner { 
          width: 100%; background: #0c0c0c; border-radius: 40px 40px 0 0; padding: 20px; 
          animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1); border-top: 1px solid #333;
        }
        .banner-image { width: 100%; height: 380px; border-radius: 30px; overflow: hidden; }
        .banner-image img { width: 100%; height: 100%; object-fit: cover; }
        .download-cta { width: 100%; padding: 20px; border-radius: 20px; border: none; background: #007AFF; color: white; font-weight: 800; margin-top: 20px; cursor: pointer; }

        /* DOCK */
        .floating-dock { 
          position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 90%; 
          background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border-radius: 30px; 
          padding: 15px; display: flex; justify-content: space-around; border: 1px solid rgba(255,255,255,0.1);
        }
        .dock-item { opacity: 0.5; transition: 0.3s; cursor: pointer; }
        .dock-item.active { opacity: 1; color: #50E3C2; }
        .label { font-size: 10px; font-weight: 800; }

        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}