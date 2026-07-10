import * as THREE from 'three';

/**
 * Procedural Texture Generator for 3D Park Elements.
 * Draws custom graphics to an HTML5 Canvas and returns high-quality THREE.CanvasTexture objects.
 */

export function createGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base grass color
  ctx.fillStyle = '#3c6e2e';
  ctx.fillRect(0, 0, 512, 512);

  // Add fine organic noise/variations
  for (let i = 0; i < 40000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = 1 + Math.random() * 2;
    const greenOffset = Math.random() * 40 - 20;
    
    ctx.fillStyle = `rgb(${Math.floor(60 + greenOffset)}, ${Math.floor(110 + greenOffset * 1.5)}, ${Math.floor(46 + greenOffset * 0.5)})`;
    ctx.fillRect(x, y, size, size);
  }

  // Draw tiny grass blades
  ctx.strokeStyle = 'rgba(40, 80, 30, 0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const height = 4 + Math.random() * 8;
    const slant = (Math.random() - 0.5) * 4;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + slant / 2, y - height / 2, x + slant, y - height);
    ctx.stroke();
  }

  // Draw some white flower dots
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

export function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base asphalt color
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, 512, 512);

  // Fine texture noise
  for (let i = 0; i < 80000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.floor(Math.random() * 40) - 20;
    ctx.fillStyle = `rgb(${42 + shade}, ${42 + shade}, ${42 + shade})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Fine cracks
  ctx.strokeStyle = '#1b1b1b';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 30;
      y += (Math.random() - 0.5) * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createFootpathTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Concrete light grey base
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, 0, 256, 256);

  // Noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const shade = Math.floor(Math.random() * 30) - 15;
    ctx.fillStyle = `rgb(${204 + shade}, ${204 + shade}, ${204 + shade})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  // Cobblestone / Paver tiles grid lines
  ctx.strokeStyle = '#8c8c8c';
  ctx.lineWidth = 2;
  
  // Outer border tiles
  ctx.strokeRect(0, 0, 256, 256);
  
  // Horizontal lines (rows of pavers)
  const rows = 4;
  const rowH = 256 / rows;
  for (let r = 1; r < rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * rowH);
    ctx.lineTo(256, r * rowH);
    ctx.stroke();
  }

  // Vertical joints (offset for brick bond effect)
  for (let r = 0; r < rows; r++) {
    const yCenter = r * rowH + rowH / 2;
    const offset = (r % 2) * 32;
    for (let c = 0; c <= 4; c++) {
      const x = c * 64 + offset;
      if (x > 0 && x < 256) {
        ctx.beginPath();
        ctx.moveTo(x, r * rowH);
        ctx.lineTo(x, (r + 1) * rowH);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm wood base
  ctx.fillStyle = '#8B5A2B'; // Warm brown
  ctx.fillRect(0, 0, 256, 64);

  // Grain lines
  ctx.strokeStyle = '#5c3a1a'; // Darker brown
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 15; i++) {
    const y = Math.random() * 64;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      64, y + (Math.random() - 0.5) * 12,
      128, y + (Math.random() - 0.5) * 12,
      256, y
    );
    ctx.stroke();
  }

  // Dark knots
  ctx.fillStyle = 'rgba(50, 30, 10, 0.3)';
  for (let i = 0; i < 3; i++) {
    const kx = Math.random() * 250;
    const ky = Math.random() * 64;
    ctx.beginPath();
    ctx.ellipse(kx, ky, 15, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createKioskMapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Information poster background - classy ivory paper texture
  ctx.fillStyle = '#fbfbf9';
  ctx.fillRect(0, 0, 512, 512);

  // Elegant Deep Slate Green header
  ctx.fillStyle = '#1b2a24';
  ctx.fillRect(0, 0, 512, 80);

  // Header Title - GRAND PARK
  ctx.fillStyle = '#ffb300'; // Gold accents
  ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GRAND PARK DIRECTORY & MAP', 256, 42);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('CURRENT REAL-TIME MAP LAYOUT', 256, 66);

  // Draw schematic map frame of the actual park
  ctx.strokeStyle = '#2d3e35';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 95, 452, 290);

  // Map background (lawn)
  ctx.fillStyle = '#e8f5e9';
  ctx.fillRect(32, 97, 448, 286);

  // Draw the main footpath loop around the park
  ctx.strokeStyle = '#d7ccc8'; // Light brown stone path
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeRect(60, 125, 392, 230); // Main path loop

  // Inner diagonal paths meeting at center
  ctx.beginPath();
  ctx.moveTo(60, 125);
  ctx.lineTo(452, 355);
  ctx.moveTo(452, 125);
  ctx.lineTo(60, 355);
  ctx.stroke();

  // Central plaza circle (for the Monument)
  ctx.fillStyle = '#cfd8dc';
  ctx.beginPath();
  ctx.arc(256, 240, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#90a4ae';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(256, 240, 42, 0, Math.PI * 2);
  ctx.stroke();

  // Draw the G monument in the center!
  // Inner blue circle representing the crystal G
  ctx.fillStyle = '#00d2ff';
  ctx.beginPath();
  ctx.arc(256, 240, 20, 0, Math.PI * 2);
  ctx.fill();

  // Letter "G" symbol in the center
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('G', 256, 240);

  // Draw the actual shops along the North and West boundaries of the park
  // 1. Library (top left)
  ctx.fillStyle = '#4e2c13'; // Mahogany
  ctx.fillRect(50, 105, 55, 30);
  ctx.strokeStyle = '#2e190a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 105, 55, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('LIB', 77, 120);

  // 2. Supermarket (top center-left)
  ctx.fillStyle = '#90a4ae'; // Grey brick
  ctx.fillRect(115, 105, 50, 30);
  ctx.strokeStyle = '#37474f';
  ctx.strokeRect(115, 105, 50, 30);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('MKT', 140, 120);

  // 3. Cafe (top center-right)
  ctx.fillStyle = '#1b5e20'; // Green
  ctx.fillRect(175, 105, 50, 30);
  ctx.strokeStyle = '#ffd54f';
  ctx.strokeRect(175, 105, 50, 30);
  ctx.fillStyle = '#ffd54f';
  ctx.fillText('CFE', 200, 120);

  // 4. Gym (top right)
  ctx.fillStyle = '#263238'; // Dark charcoal
  ctx.fillRect(235, 105, 45, 30);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(235, 105, 45, 30);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GYM', 257, 120);

  // 5. Chess Arena (mid right)
  ctx.fillStyle = '#004d40'; // Emerald
  ctx.fillRect(290, 105, 50, 30);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(290, 105, 50, 30);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CHS', 315, 120);

  // 6. Cricket Practice Nets (far right back)
  ctx.fillStyle = '#388e3c'; // Turf Green
  ctx.fillRect(350, 105, 55, 30);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(350, 105, 55, 30);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('NETS', 377, 120);

  // 7. Bistro / Restaurant (West side middle)
  ctx.fillStyle = '#211007'; // Wood
  ctx.fillRect(415, 105, 50, 30);
  ctx.strokeStyle = '#ffb300';
  ctx.strokeRect(415, 105, 50, 30);
  ctx.fillStyle = '#ffb300';
  ctx.fillText('BST', 440, 120);

  // Draw some trees
  ctx.fillStyle = '#4caf50';
  const realTrees = [
    [80, 180], [130, 320], [380, 320], [420, 180]
  ];
  realTrees.forEach(([tx, ty]) => {
    ctx.beginPath();
    ctx.arc(tx, ty, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Bus Stops on South side
  ctx.fillStyle = '#fbc02d';
  ctx.fillRect(100, 358, 25, 10);
  ctx.fillRect(380, 358, 25, 10);

  // Corner Stadium Lights (Grey circles)
  ctx.fillStyle = '#37474f';
  const lights = [
    [45, 110], [465, 110], [45, 370], [465, 370]
  ];
  lights.forEach(([lx, ly]) => {
    ctx.beginPath();
    ctx.arc(lx, ly, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Legend at the bottom
  ctx.fillStyle = '#eceff1';
  ctx.fillRect(30, 395, 452, 105);
  ctx.strokeStyle = '#cfd8dc';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 395, 452, 105);

  ctx.fillStyle = '#1b2a24';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MAP DIRECTORY & LEGEND', 42, 412);

  // Legend Items
  // 1. Crystal G
  ctx.fillStyle = '#00d2ff';
  ctx.beginPath();
  ctx.arc(52, 432, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1b2a24';
  ctx.font = '10px sans-serif';
  ctx.fillText('Crystal G Monument (Center)', 64, 435);

  // 2. Shops
  ctx.fillStyle = '#1b5e20';
  ctx.fillRect(235, 426, 12, 8);
  ctx.fillStyle = '#1b2a24';
  ctx.fillText('Shops & Cafe/Library/Gym', 254, 433);

  // 3. Cricket Nets
  ctx.fillStyle = '#388e3c';
  ctx.fillRect(52, 450, 12, 8);
  ctx.fillStyle = '#1b2a24';
  ctx.fillText('Cricket Practice Nets (Back)', 70, 457);

  // 4. Stadium Lights
  ctx.fillStyle = '#37474f';
  ctx.beginPath();
  ctx.arc(241, 454, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1b2a24';
  ctx.fillText('Stadium Light Poles', 254, 457);

  // Welcome line
  ctx.fillStyle = '#2e7d32';
  ctx.font = 'italic 10.5px sans-serif';
  ctx.fillText('Welcome to Grand Park! All shops are grounded and open for visits.', 42, 485);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createSignboardTexture(text: string, bgColor: string = '#212121', textColor: string = '#ffd54f'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 512, 128);

  // Borders
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 512 - 16, 128 - 16);

  // Accent corners
  ctx.fillStyle = textColor;
  ctx.fillRect(14, 14, 12, 12);
  ctx.fillRect(512 - 26, 14, 12, 12);
  ctx.fillRect(14, 128 - 26, 12, 12);
  ctx.fillRect(512 - 26, 128 - 26, 12, 12);

  // Text
  ctx.font = 'bold 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw text with a subtle shadow
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.fillText(text.toUpperCase(), 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

