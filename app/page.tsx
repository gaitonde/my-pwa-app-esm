'use client'; // This component needs client-side interactivity

import React, { useState, useEffect } from 'react';

// Add this at the top of your file (before imports)
type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
};

export default function Home() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPromptEvent(e);
      console.log(`'beforeinstallprompt' event was fired.`);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }

    // Show the install prompt
    installPromptEvent.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPromptEvent.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }

    // We can't reuse the event, so set it to null
    setInstallPromptEvent(null);
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('capture', 'camera'); // This hints to use the camera

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCapturedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleUpload = async () => {
    if (capturedImage) {
      // Mock upload logic (replace with your actual API call)
      console.log('Uploading image...', capturedImage.substring(0, 50) + '...');
      // In a real application, you would send 'capturedImage' (as a data URL or convert it to a Blob) to your server.
      alert('Image uploaded (mocked)! Check the console.');
      setCapturedImage(null); // Clear the image after "upload"
    } else {
      alert('No image captured to upload.');
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>xxWelcome to My Simple PWA (ESM + TypeScript)!</h1>
      <p>This is a basic Progressive Web App built with Next.js (ESM) and TypeScript, ready to be installed.</p>

      {installPromptEvent && (
        <button style={{ padding: '10px 20px', margin: '20px 0', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleInstallClick}>
          Install App
        </button>
      )}

      <div>
        <button style={{ padding: '10px 20px', margin: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleTakePhoto}>
          Take Photo
        </button>
        {capturedImage && (
          <div>
            <img src={capturedImage} alt="Captured" style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px' }} />
            <button style={{ padding: '10px 20px', margin: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleUpload}>
              Upload Photo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
