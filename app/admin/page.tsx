'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
  // ESTADOS DE SUBIDA
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General'); // Categoría por defecto al subir
  const [uploading, setUploading] = useState(false);

  // ESTADOS DE GESTIÓN
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // ESTADO DE SEGURIDAD
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const ADMIN_PASSWORD = "admin14112001"; 

  // LAS CATEGORÍAS DE TU APP
  const categories = ['General', 'Trending', 'Anime', 'Setup', 'Minimal', 'Premium'];

  // 1. CARGAR DATOS AL INICIAR
  useEffect(() => {
    if (isAuthenticated) {
      fetchWallpapers();
    }
  }, [isAuthenticated]);

  const fetchWallpapers = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from('wallpapers')
      .select('*')
      .order('id', { ascending: false }); // Los más nuevos primero
    
    if (data) setWallpapers(data);
    setLoadingData(false);
  };

  // 2. LOGIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Acceso Denegado ❌");
    }
  };

  // 3. SUBIR WALLPAPER (Ahora con categoría)
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return alert('Faltan datos');
    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`; // Limpia nombre
      
      // A) Subir archivo
      const { error: upErr } = await supabase.storage.from('imagenes').upload(fileName, file);
      if (upErr) throw upErr;

      // B) Obtener URL pública
      const { data: urlData } = supabase.storage.from('imagenes').getPublicUrl(fileName);

      // C) Guardar en base de datos con la categoría seleccionada
      const { error: dbErr } = await supabase
        .from('wallpapers')
        .insert([{ 
          name: name, 
          irl: urlData.publicUrl, 
          category: category,
          premium: category === 'Premium' // Auto-detectar si es premium
        }]);

      if (dbErr) throw dbErr;

      alert('¡Subido con éxito! 🚀');
      setName('');
      setFile(null);
      fetchWallpapers(); // Refrescar la lista de abajo
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 4. MOVER DE CARPETA (Actualizar Categoría)
  const handleMoveCategory = async (id: number, newCategory: string) => {
    try {
      const { error } = await supabase
        .from('wallpapers')
        .update({ 
          category: newCategory,
          premium: newCategory === 'Premium' // Si lo mueves a Premium, se marca como premium
        })
        .eq('id', id);

      if (error) throw error;
      
      // Actualizar la lista localmente para que se vea rápido
      setWallpapers(prev => prev.map(wp => 
        wp.id === id ? { ...wp, category: newCategory, premium: newCategory === 'Premium' } : wp
      ));

    } catch (err: any) {
      alert('Error al mover: ' + err.message);
    }
  };

  // 5. BORRAR WALLPAPER
  const handleDelete = async (id: number, url: string) => {
    if(!confirm("¿Seguro que quieres eliminar este wallpaper?")) return;

    try {
        // Extraer nombre del archivo de la URL para borrar del storage (opcional, pero recomendado)
        // const fileName = url.split('/').pop();
        // await supabase.storage.from('imagenes').remove([fileName]);

        const { error } = await supabase.from('wallpapers').delete().eq('id', id);
        if(error) throw error;
        
        setWallpapers(prev => prev.filter(wp => wp.id !== id));
    } catch (err: any) {
        alert('Error al borrar: ' + err.message);
    }
  }

  // PANTALLA DE LOGIN
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>iVibe Admin</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" placeholder="Password" 
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.buttonMain}>ACCEDER</button>
          </form>
        </div>
      </div>
    );
  }

  // PANEL PRINCIPAL
  return (
    <div style={styles.adminContainer}>
      <div style={styles.contentWrapper}>
        
        {/* CABECERA */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}}>
            <h2 style={{ fontSize: '24px', margin: 0 }}>🚀 Panel de Control</h2>
            <button onClick={() => setIsAuthenticated(false)} style={styles.buttonDanger}>Salir</button>
        </div>

        {/* SECCIÓN 1: SUBIR NUEVO */}
        <div style={styles.card}>
            <h3 style={styles.cardTitle}>Subir Nuevo Wallpaper</h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input 
                    type="text" placeholder="Nombre" 
                    value={name} onChange={(e) => setName(e.target.value)} 
                    style={{...styles.input, flex: 1}} 
                />
                
                <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    style={{...styles.input, width: '120px'}}
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    style={{...styles.input, padding: '12px'}} 
                />
                
                <button type="submit" disabled={uploading} style={styles.buttonAction}>
                    {uploading ? '⏳' : 'SUBIR'}
                </button>
            </form>
        </div>

        {/* SECCIÓN 2: GESTIONAR EXISTENTES */}
        <div style={{ marginTop: '40px' }}>
            <h3 style={styles.cardTitle}>Gestionar Galería ({wallpapers.length})</h3>
            
            {loadingData ? <p>Cargando...</p> : (
                <div style={styles.grid}>
                    {wallpapers.map((wp) => (
                        <div key={wp.id} style={styles.itemCard}>
                            <div style={styles.imgWrapper}>
                                <img src={wp.irl} alt={wp.name} style={styles.img} />
                                <span style={styles.badge}>{wp.category}</span>
                            </div>
                            
                            <div style={{ padding: '10px' }}>
                                <p style={{ margin: '0 0 10px', fontWeight: 'bold', fontSize: '14px' }}>{wp.name}</p>
                                
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {/* SELECTOR MÁGICO PARA MOVER DE CARPETA */}
                                    <select 
                                        value={wp.category} 
                                        onChange={(e) => handleMoveCategory(wp.id, e.target.value)}
                                        style={styles.miniSelect}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>

                                    <button onClick={() => handleDelete(wp.id, wp.irl)} style={styles.miniDelete}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

// ESTILOS EN JS PARA NO COMPLICAR EL CSS
const styles: any = {
  loginContainer: { background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' },
  loginBox: { padding: '40px', background: '#111', borderRadius: '20px', border: '1px solid #333', textAlign: 'center' },
  adminContainer: { background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '20px' },
  contentWrapper: { maxWidth: '800px', margin: '0 auto' },
  card: { background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222' },
  cardTitle: { marginTop: 0, color: '#007AFF', fontSize: '16px', textTransform: 'uppercase' },
  input: { background: '#222', border: '1px solid #333', color: '#fff', padding: '15px', borderRadius: '10px', outline: 'none' },
  buttonMain: { width: '100%', marginTop: '15px', padding: '12px', borderRadius: '10px', background: '#007AFF', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  buttonAction: { padding: '15px 30px', background: '#fff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  buttonDanger: { background: 'transparent', border: '1px solid #ff3b30', color: '#ff3b30', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' },
  
  // Grid de gestión
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' },
  itemCard: { background: '#161616', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' },
  imgWrapper: { height: '120px', overflow: 'hidden', position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  badge: { position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.7)', fontSize: '10px', padding: '3px 8px', borderRadius: '10px' },
  miniSelect: { flex: 1, background: '#333', color: '#fff', border: 'none', padding: '5px', borderRadius: '5px', fontSize: '11px', cursor: 'pointer' },
  miniDelete: { background: '#330000', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px' }
};