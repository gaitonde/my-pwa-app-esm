import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Simple PWA',
  description: 'A simple downloadable PWA with camera support.',
  themeColor: '#007bff',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007bff" />
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
