const withPWA = require('next-pwa')({ // Note: require is CommonJS, but the output of this file is used by Next.js which handles ES Modules internally.
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other Next.js configurations if you have any ...
  experimental: {
    esmExternals: true, // Explicitly tell Next.js to treat external packages as ESM (recommended)
  },
};

module.exports = withPWA(nextConfig);
