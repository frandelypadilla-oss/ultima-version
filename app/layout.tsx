import { Metadata } from 'next';
import { WallpaperProvider } from './context/WallpaperContext';

// Metadatos para que el móvil reconozca la App y el Manifest
export const metadata: Metadata = {
  title: 'iVibe PRO',
  description: 'Premium Liquid Glass Wallpapers',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'iVibe PRO',
  },
  icons: {
    icon: '/icon-512x512.png',
    apple: '/icon-512x512.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Esto asegura que el icono y el manifest funcionen en todos los navegadores */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
      </head>
      <body style={{ margin: 0, background: '#000' }}>
        <WallpaperProvider>
          {children}
        </WallpaperProvider>
      </body>
    </html>
  );
}