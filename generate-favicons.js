import fs from 'fs';
import path from 'path';

// Create favicon and Apple touch icon SVG files
function createFaviconSVG(size, filename) {
  const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1d4ed8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#faviconGradient${size})"/>
  
  <!-- Chart line -->
  <path d="M ${size * 0.15},${size * 0.7} L ${size * 0.3},${size * 0.5} L ${size * 0.5},${size * 0.6} L ${size * 0.7},${size * 0.4} L ${size * 0.85},${size * 0.45}" 
        fill="none" stroke="#ffffff" stroke-width="${Math.max(2, size * 0.03)}" stroke-linecap="round"/>
  
  <!-- Data points -->
  <circle cx="${size * 0.3}" cy="${size * 0.5}" r="${Math.max(1, size * 0.03)}" fill="#fbbf24"/>
  <circle cx="${size * 0.7}" cy="${size * 0.4}" r="${Math.max(1, size * 0.03)}" fill="#fbbf24"/>
  
  <!-- CT text for larger sizes -->
  ${size >= 32 ? `<text x="${size/2}" y="${size * 0.85}" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size * 0.12}" font-weight="bold">CT</text>` : ''}
</svg>`;

  const publicDir = path.join(__dirname, 'public');
  fs.writeFileSync(path.join(publicDir, filename), svgContent);
  console.log(`Created ${filename} (${size}x${size})`);
}

// Create favicon.ico placeholder (SVG version)
const faviconIcoContent = `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="icoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="48" height="48" rx="7" fill="url(#icoGradient)"/>
  <path d="M 8,32 L 16,22 L 24,28 L 32,18 L 40,22" 
        fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <circle cx="16" cy="22" r="2" fill="#fbbf24"/>
  <circle cx="32" cy="18" r="2" fill="#fbbf24"/>
  <text x="24" y="40" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="6" font-weight="bold">CT</text>
</svg>`;

console.log('Generating favicon and Apple touch icons...');

// Create favicon sizes
createFaviconSVG(16, 'favicon-16x16.svg');
createFaviconSVG(32, 'favicon-32x32.svg');
createFaviconSVG(96, 'favicon-96x96.svg');
createFaviconSVG(180, 'apple-touch-icon.svg');

// Create favicon.ico (as SVG for now)
const publicDir = path.join(__dirname, 'public');
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconIcoContent);

console.log('Favicon and Apple touch icon generation complete!');
