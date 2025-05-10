import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple PWA ESM',
  description: 'A basic Progressive Web App built with Next.js (ESM) and TypeScript.',
  manifest: '/manifest.json',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
