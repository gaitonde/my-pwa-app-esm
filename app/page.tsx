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

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Camera capture
  const handleTakePhoto = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      {installPrompt && (
        <button onClick={handleInstall} style={{ margin: 16, padding: '10px 20px' }}>
          Install App
        </button>
      )}
      <button onClick={handleTakePhoto} style={{ margin: 16, padding: '10px 20px' }}>
        Take Photo
      </button>
      {photo && (
        <div>
          <img src={photo} alt="Captured" style={{ maxWidth: 300, margin: 16 }} />
        </div>
      )}
    </main>
  );
}
