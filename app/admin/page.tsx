'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPanelFullFix() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [uploading, setUploading] = useState(false);
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = "admin14112001"; 

  const categories = ['General', 'Trending', 'Anime', 'Minimal', 'Premium', 'Setup', 'Mockup'];

  useEffect(() => {
    if (isAuthenticated) fetchWallpapers();
  }, [isAuthenticated]);

  const fetchWallpapers = async () => {
    setLoadingList(true);
    try {
      const { data, error } = await supabase.from('wallpapers').select('*');
      if (error) throw error;
      setWallpapers(data || []);
    } catch (err: any) {
      alert("Error al cargar biblioteca: " + err.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert("Contraseña incorrecta");
  };

  // CAMBIAR CATEGORÍA (ARREGLADO)
  const updateCategory = async (id: number, newCat: string) => {
    try {
      const { error } = await supabase
        .from('wallpapers')
        .update({ category: newCat })
        .eq('id', id);

      if (error) throw error;
      
      // Actualización visual instantánea
      setWallpapers(prev => prev.map(wp => wp.id === id ? { ...wp, category: newCat } : wp));
    } catch (err: any) {
      alert("No se pudo cambiar la categoría: " + err.message);
    }
  };

  // SUBIR NUEVO (ARREGLADO PARA USAR 'URL')
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return alert('Ponle un nombre y elige una imagen');
    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error: upErr } = await supabase.storage.from('imagenes').upload(fileName, file);
      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(fileName);

      const { error: dbErr } = await supabase.from('wallpapers').insert([{ 
        name: name, 
        url: publicUrl, // Aquí usamos 'url' como en tu tabla
        category: category 
      }]);

      if (dbErr) throw dbErr;

      alert("¡Subido con éxito! 🚀");
      setName(''); setFile(null);
      fetchWallpapers();
    } catch (err: any) {
      alert("Error al subir: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteWp = async (id: number) => {
    if (!confirm("¿Borrar permanentemente?")) return;
    const { error } = await supabase.from('wallpapers').delete().eq('id', id);
    if (!error) fetchWallpapers();
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-screen">
        <form onSubmit={handleLogin} className="auth-card glass">
          <h1>iVibe Admin</h1>
          <input type="password" placeholder="PIN" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">ENTRAR</button>
        </form>
        <style jsx>{`
          .auth-screen { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; font-family: sans-serif; }
          .glass { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); text-align: center; }
          input { width: 100%; padding: 12px; margin: 20px 0; background: #111; border: 1px solid #333; color: #fff; border-radius: 10px; text-align: center; }
          button { width: 100%; padding: 12px; background: #007AFF; border: none; color: #fff; border-radius: 10px; font-weight: bold; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-content">
        <header className="admin-header">
          <h2>Control Center</h2>
          <button onClick={() => setIsAuthenticated(false)} className="exit-btn">Cerrar Sesión</button>
        </header>

        <section className="form-card glass">
          <h3>Subir Nuevo Wallpaper</h3>
          <form onSubmit={handleUpload} className="upload-grid">
            <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
            <button type="submit" disabled={uploading}>{uploading ? '...' : 'PUBLICAR'}</button>
          </form>
        </section>

        <section className="library-section">
          <h3>Biblioteca ({wallpapers.length} registros)</h3>
          <div className="admin-grid">
            {loadingList ? (
              <p>Conectando con Supabase...</p>
            ) : (
              wallpapers.map(wp => (
                <div key={wp.id} className="wp-card glass">
                  <img src={wp.url} alt="" />
                  <div className="wp-actions">
                    <p>{wp.name}</p>
                    <select value={wp.category} onChange={(e) => updateCategory(wp.id, e.target.value)}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => deleteWp(wp.id)} className="delete-btn">Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .admin-wrapper { background: #000; min-height: 100vh; color: #fff; padding: 40px 20px; font-family: system-ui; }
        .admin-content { max-width: 1100px; margin: 0 auto; }
        .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; }
        
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .exit-btn { background: none; border: 1px solid #333; color: #666; padding: 8px 15px; border-radius: 10px; cursor: pointer; }

        .form-card { padding: 30px; margin-bottom: 50px; }
        .upload-grid { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 15px; }
        
        input, select { background: #111; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 12px; }
        
        .admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; }
        .wp-card { overflow: hidden; display: flex; flex-direction: column; }
        .wp-card img { width: 100%; height: 280px; object-fit: cover; background: #111; }
        
        .wp-actions { padding: 15px; }
        .wp-actions p { margin: 0 0 10px; font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wp-actions select { width: 100%; padding: 8px; font-size: 12px; background: #1a1a1a; margin-bottom: 10px; }
        
        .delete-btn { width: 100%; background: transparent; border: 1px solid #ff3b30; color: #ff3b30; padding: 8px; border-radius: 10px; font-size: 11px; cursor: pointer; }
        .delete-btn:hover { background: #ff3b30; color: #fff; }
      `}</style>
    </div>
  );
}