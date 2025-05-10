interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
}

interface Manifest {
  name: string;
  short_name?: string;
  description?: string;
  start_url?: string;
  display?: 'standalone' | 'minimal-ui' | 'browser' | 'fullscreen';
  background_color?: string;
  theme_color?: string;
  icons?: ManifestIcon[];
}

declare module './public/manifest.json' {
  const manifest: Manifest;
  export default manifest;
}
