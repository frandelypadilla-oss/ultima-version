'use client';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // ESTADO DE SEGURIDAD
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Cambia 'tu_password_aqui' por la que tú quieras
  const ADMIN_PASSWORD = "admin14112001"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Acceso Denegado ❌");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return alert('Faltan datos');
    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('imagenes').upload(fileName, file);
      if (upErr) throw upErr;

      const { data } = supabase.storage.from('imagenes').getPublicUrl(fileName);

      const { error: dbErr } = await supabase
        .from('wallpapers')
        .insert([{ name: name, irl: data.publicUrl, category: 'General' }]);

      if (dbErr) throw dbErr;

      alert('¡Publicado con éxito en IRL! 🚀');
      setName('');
      setFile(null);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // PANTALLA DE BLOQUEO (Si no está autenticado)
  if (!isAuthenticated) {
    return (
      <div style={{ 
        background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif' 
      }}>
        <div style={{ 
          padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', 
          border: '0.5px solid rgba(255,255,255,0.1)', textAlign: 'center', backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{ color: '#fff', marginBottom: '20px', letterSpacing: '-1px' }}>iVibe Admin Panel</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.2)',
                padding: '15px', borderRadius: '12px', color: '#fff', width: '200px', textAlign: 'center'
              }}
            />
            <button type="submit" style={{ 
              display: 'block', width: '100%', marginTop: '15px', padding: '12px', 
              borderRadius: '12px', background: '#007AFF', color: '#fff', border: 'none', fontWeight: 'bold'
            }}>
              ACCEDER
            </button>
          </form>
        </div>
      </div>
    );
  }

  // PANEL DE ADMINISTRACIÓN REAL (Solo visible si isAuthenticated es true)
  return (
    <div style={{ padding: '40px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '30px', letterSpacing: '-1.5px' }}>🚀 Panel de Control</h2>
        <p style={{ color: '#007AFF', fontSize: '12px', fontWeight: 'bold', marginBottom: '40px' }}>LOGUEADO COMO ADMINISTRADOR</p>
        
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', opacity: 0.6 }}>Nombre del Wallpaper</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '15px', borderRadius: '12px' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', opacity: 0.6 }}>Archivo de Imagen</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              style={{ background: '#111', padding: '15px', borderRadius: '12px', fontSize: '12px' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={uploading} 
            style={{ 
              marginTop: '20px', padding: '20px', background: '#fff', color: '#000', 
              border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer',
              opacity: uploading ? 0.5 : 1
            }}
          >
            {uploading ? 'SUBIENDO...' : 'PUBLICAR EN IVIBE PRO'}
          </button>
        </form>
        
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ background: 'none', border: 'none', color: '#ff3b30', marginTop: '40px', cursor: 'pointer', fontSize: '12px' }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}