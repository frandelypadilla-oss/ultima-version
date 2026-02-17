'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminFinalPro() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [uploading, setUploading] = useState(false);
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const categories = ['General', 'Trending', 'Anime', 'Minimal', 'Premium', 'Setup', 'Mockup'];

  useEffect(() => {
    if (isAuthenticated) fetchWallpapers();
  }, [isAuthenticated]);

  const fetchWallpapers = async () => {
    // Pedimos solo lo necesario para que cargue rápido
    const { data } = await supabase.from('wallpapers').select('id, name, irl, category').order('id', { ascending: false });
    if (data) setWallpapers(data);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return alert('Datos incompletos');
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error: storageError } = await supabase.storage.from('imagenes').upload(fileName, file);
      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(fileName);

      // CORRECCIÓN CLAVE: Usamos 'irl' y 'premium'
      const { data: newWp, error: dbError } = await supabase.from('wallpapers').insert([{ 
        name, 
        irl: publicUrl, 
        category,
        premium: category === 'Premium'
      }]).select();

      if (dbError) throw dbError;

      alert("¡Subido con éxito!");
      setWallpapers([newWp[0], ...wallpapers]); // Actualización instantánea sin recargar todo
      setName(''); setFile(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const updateCategory = async (id: number, newCat: string) => {
    const { error } = await supabase.from('wallpapers').update({ category: newCat }).eq('id', id);
    if (!error) {
      setWallpapers(wallpapers.map(wp => wp.id === id ? { ...wp, category: newCat } : wp));
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <input type="password" placeholder="PIN" onChange={e => e.target.value === "admin14112001" && setIsAuthenticated(true)} 
        style={{padding:'15px', borderRadius:'10px', border:'1px solid #333', background:'#111', color:'#fff', textAlign:'center'}} />
      </div>
    );
  }

  return (
    <div style={{background:'#000', minHeight:'100vh', color:'#fff', padding:'20px', fontFamily:'sans-serif'}}>
      <header style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
        <h2>Control Center</h2>
        <span style={{color:'#444'}}>{wallpapers.length} registros</span>
      </header>

      <section style={{background:'#0a0a0a', padding:'20px', borderRadius:'15px', border:'1px solid #1a1a1a', marginBottom:'40px'}}>
        <form onSubmit={handleUpload} style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} style={{flex:1, padding:'10px', background:'#111', color:'#fff', border:'1px solid #333'}}/>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{padding:'10px', background:'#111', color:'#fff'}}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
          <button type="submit" disabled={uploading} style={{background:'#007AFF', color:'#fff', padding:'10px 25px', borderRadius:'8px', border:'none'}}>
            {uploading ? 'Subiendo...' : 'PUBLICAR'}
          </button>
        </form>
      </section>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px'}}>
        {wallpapers.map(wp => (
          <div key={wp.id} style={{background:'#0a0a0a', borderRadius:'12px', border:'1px solid #1a1a1a', overflow:'hidden'}}>
            <img src={wp.irl} loading="lazy" style={{width:'100%', height:'250px', objectFit:'cover'}} />
            <div style={{padding:'10px'}}>
              <p style={{fontSize:'14px', fontWeight:'bold', marginBottom:'10px'}}>{wp.name}</p>
              <select value={wp.category} onChange={(e) => updateCategory(wp.id, e.target.value)} style={{width:'100%', padding:'8px', background:'#1a1a1a', color:'#fff', border:'1px solid #333'}}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}