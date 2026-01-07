'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Wallpaper {
  id: number;
  name: string;
  url: string;
  category: string;
}

interface WallpaperContextType {
  wallpapers: Wallpaper[];
  addWallpaper: (name: string, url: string, category: string) => void;
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(
  undefined
);

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([
    {
      id: 1,
      name: 'Liquid Aurora',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      category: 'Liquid',
    },
  ]);

  const addWallpaper = (name: string, url: string, category: string) => {
    const newWp = { id: Date.now(), name, url, category };
    setWallpapers((prev) => [newWp, ...prev]);
  };

  return (
    <WallpaperContext.Provider value={{ wallpapers, addWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpapers() {
  const context = useContext(WallpaperContext);
  if (!context) throw new Error('useWallpapers error');
  return context;
} // <---
