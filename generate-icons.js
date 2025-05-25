import fs from 'fs';
import path from 'path';

// Simple PNG header creator for solid color icons
function createSimplePNGIcon(size, outputPath) {
  // This is a placeholder - in a real scenario you'd use a library like sharp or canvas
  // For now, I'll create SVG versions that can be easily converted
  const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cryptoGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1d4ed8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#cryptoGradient${size})" stroke="#1e40af" stroke-width="2"/>
  
  <!-- Chart line -->
  <path d="M ${size * 0.2},${size * 0.65} L ${size * 0.35},${size * 0.55} L ${size * 0.5},${size * 0.6} L ${size * 0.65},${size * 0.45} L ${size * 0.8},${size * 0.5}" 
        fill="none" stroke="#ffffff" stroke-width="${size * 0.02}" stroke-linecap="round"/>
  
  <!-- Data points -->
  <circle cx="${size * 0.2}" cy="${size * 0.65}" r="${size * 0.02}" fill="#fbbf24"/>
  <circle cx="${size * 0.35}" cy="${size * 0.55}" r="${size * 0.02}" fill="#fbbf24"/>
  <circle cx="${size * 0.5}" cy="${size * 0.6}" r="${size * 0.02}" fill="#fbbf24"/>
  <circle cx="${size * 0.65}" cy="${size * 0.45}" r="${size * 0.02}" fill="#fbbf24"/>
  <circle cx="${size * 0.8}" cy="${size * 0.5}" r="${size * 0.02}" fill="#fbbf24"/>
  
  <!-- Alert bell -->
  <path d="M ${size * 0.45},${size * 0.75} Q ${size * 0.45},${size * 0.7} ${size * 0.5},${size * 0.7} Q ${size * 0.55},${size * 0.7} ${size * 0.55},${size * 0.75} L ${size * 0.55},${size * 0.8} Q ${size * 0.55},${size * 0.83} ${size * 0.52},${size * 0.83} L ${size * 0.48},${size * 0.83} Q ${size * 0.45},${size * 0.83} ${size * 0.45},${size * 0.8} Z" 
        fill="#ffffff"/>
  <circle cx="${size/2}" cy="${size * 0.85}" r="${size * 0.01}" fill="#f59e0b"/>
</svg>`;

  // Save as SVG for now (can be converted to PNG later)
  fs.writeFileSync(outputPath.replace('.png', '.svg'), svgContent);
}

// Generate all required icon sizes
const sizes = [72, 96, 128, 144, 152, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  createSimplePNGIcon(size, outputPath);
  console.log(`Created icon for ${size}x${size}`);
});

console.log('All icons generated successfully!');
