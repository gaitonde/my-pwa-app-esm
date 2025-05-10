'use client'; // This component needs client-side interactivity

import React, { useState, useEffect } from 'react';

// Add this at the top of your file (before imports)
type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
};

export default function Home() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    // Detect iOS
    setIsIos(
      /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    );
    // Detect if app is already installed
    setIsInStandaloneMode(
      'standalone' in window.navigator && Boolean((window.navigator as { standalone?: boolean }).standalone)
    );
  }, []);

  // Camera capture
  const handleTakePhoto = async () => {
    try {
      // Request camera permission
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   video: { facingMode: { exact: "environment" } }
      // });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });      
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      // Create a canvas to capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL('image/png'));
      }
      // Stop all video tracks
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error('Camera access denied or not available.', err);
      alert('Camera access denied or not available.');
    }
  };

  // Install PWA
  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (result.outcome === 'accepted') {
        alert('App installed!');
      }
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: 32 }}>
      <h1>Welcome to My Simple PWA!</h1>
      <p>This is a downloadable PWA with camera support.</p>
      {(isIos && !isInStandaloneMode) ? (
        <button
          style={{ margin: 16, padding: '10px 20px' }}
          onClick={() => alert('To install this app, tap the Share button in Safari or Chrome, then "Add to Home Screen".')}
        >
          Install App
        </button>
      ) : installPrompt && (
        <button onClick={handleInstall} style={{ margin: 16, padding: '10px 20px' }}>
          Install App
        </button>
      )}
      <button onClick={handleTakePhoto} style={{ margin: 16, padding: '10px 20px' }}>
        Take Photo
      </button>
      <button
  onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
  style={{ margin: 8, padding: '6px 12px' }}
>
  Use {facingMode === 'user' ? 'Back' : 'Front'} Camera
</button>      
      {photo && (
        <div>
          <img src={photo} alt="Captured" style={{ maxWidth: 300, margin: 16 }} />
        </div>
      )}
    </main>
  );
}
