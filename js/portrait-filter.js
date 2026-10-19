/**
 * PORTRAIT FILTER & INTERACTIVE APERTURE
 * 
 * - Renders portrait as an engineering artifact (halftone / duotone ink + orange)
 * - On hover / focus / pointer move, smooth aperture reveals original photo underneath
 * - Works on touch devices with a tap-to-toggle reveal
 * - Fully respects prefers-reduced-motion
 * - Graceful fallback from portrait.jpg to portrait.svg
 */

export function initPortraitFilter() {
  const container = document.getElementById('portrait-container');
  const canvas = document.getElementById('portrait-canvas');
  const baseImg = document.getElementById('portrait-base-image');

  if (!container || !canvas || !baseImg) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isTouchInput = window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth <= 820;

  // Aperture state
  let mouse = { x: -1000, y: -1000, targetRadius: 0, currentRadius: 0, active: false };
  let isHovered = false;
  let isFocused = false;
  let animId = null;
  let imgLoaded = false;
  let touchRevealPinned = false;
  let offscreenCanvas = document.createElement('canvas');
  let offCtx = offscreenCanvas.getContext('2d');

  function updateInputMode() {
    isTouchInput = window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth <= 820;
    container.setAttribute(
      'aria-label',
      isTouchInput
        ? 'Interactive engineering portrait. Tap to reveal the photo; tap again to hide it.'
        : 'Interactive engineering portrait of the author. Hover or focus to reveal the original photo.'
    );
  }

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    renderHalftoneBase();
    drawFrame();
  }

  // Pre-render the heavily blurred black-and-white pattern layer onto the offscreen canvas
  function renderHalftoneBase() {
    if (!imgLoaded || !offCtx) return;
    const w = offscreenCanvas.width;
    const h = offscreenCanvas.height;
    const dpr = window.devicePixelRatio || 1;

    // Calculate aspect-ratio cover crop for pixel-perfect alignment with underlying photo
    const imgW = baseImg.naturalWidth || baseImg.width || w;
    const imgH = baseImg.naturalHeight || baseImg.height || h;
    const imgRatio = imgW / imgH;
    const canvasRatio = w / h;
    let sWidth = imgW;
    let sHeight = imgH;
    let sx = 0;
    let sy = 0;

    if (imgRatio > canvasRatio) {
      sWidth = imgH * canvasRatio;
      sx = (imgW - sWidth) / 2;
    } else {
      sHeight = imgW / canvasRatio;
      sy = (imgH - sHeight) / 2;
    }

    offCtx.clearRect(0, 0, w, h);

    // 1. Draw HEAVILY BLURRED BLACK & WHITE image to obscure personal identity
    offCtx.save();
    offCtx.filter = 'grayscale(100%) blur(20px) contrast(140%) brightness(88%)';
    // Draw slightly oversized to avoid edge blur cutoffs
    offCtx.drawImage(baseImg, sx, sy, sWidth, sHeight, -20, -20, w + 40, h + 40);
    offCtx.filter = 'none';
    offCtx.restore();

    // 2. Overlay engineering and cybersecurity patterns in Black & White
    offCtx.save();

    // Pattern A: Horizontal CRT Scanlines (black/white raster)
    offCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    const scanStep = Math.max(2, Math.round(3 * dpr));
    for (let y = 0; y < h; y += scanStep) {
      offCtx.fillRect(0, y, w, 1);
    }

    // Pattern B: Technical Coordinate Grid
    const gridSize = Math.round(26 * dpr);
    offCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    offCtx.lineWidth = 1;
    for (let x = 0; x < w; x += gridSize) {
      offCtx.beginPath();
      offCtx.moveTo(x, 0);
      offCtx.lineTo(x, h);
      offCtx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      offCtx.beginPath();
      offCtx.moveTo(0, y);
      offCtx.lineTo(w, y);
      offCtx.stroke();
    }

    // Pattern C: Digital Halftone Dot Grid
    const dotSpacing = Math.round(13 * dpr);
    offCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let y = 0; y < h; y += dotSpacing) {
      for (let x = 0; x < w; x += dotSpacing) {
        offCtx.beginPath();
        offCtx.arc(x + 6 * dpr, y + 6 * dpr, 1.2 * dpr, 0, Math.PI * 2);
        offCtx.fill();
      }
    }

    // Pattern D: Security Corner Hashes
    offCtx.strokeStyle = 'rgba(212, 75, 50, 0.45)';
    offCtx.lineWidth = 1.2;
    for (let i = 0; i < 48 * dpr; i += 8 * dpr) {
      // Top-left
      offCtx.beginPath();
      offCtx.moveTo(i, 0);
      offCtx.lineTo(0, i);
      offCtx.stroke();
      // Bottom-right
      offCtx.beginPath();
      offCtx.moveTo(w - i, h);
      offCtx.lineTo(w, h - i);
      offCtx.stroke();
    }

    // Pattern E: Center Redacted / Security Badge
    const prompt = isTouchInput ? 'TAP TO REVEAL' : 'HOVER TO REVEAL';
    const badgeH = Math.round(32 * dpr);
    const availableTextWidth = Math.max(0, w - 36 * dpr);
    const fontSize = Math.max(7 * dpr, Math.min(9.5 * dpr, availableTextWidth / (prompt.length * 0.62)));
    offCtx.font = `600 ${Math.round(fontSize)}px 'IBM Plex Mono', monospace`;
    const badgeW = Math.min(w - 16 * dpr, Math.ceil(offCtx.measureText(prompt).width + 20 * dpr));
    const badgeX = Math.round((w - badgeW) / 2);
    const badgeY = Math.round((h - badgeH) / 2);

    offCtx.fillStyle = 'rgba(0, 0, 0, 0.88)';
    offCtx.fillRect(badgeX, badgeY, badgeW, badgeH);
    offCtx.strokeStyle = 'rgba(212, 75, 50, 0.85)';
    offCtx.strokeRect(badgeX, badgeY, badgeW, badgeH);

    offCtx.fillStyle = '#FFFFFF';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(prompt, w / 2, h / 2, Math.max(0, badgeW - 12 * dpr));

    offCtx.restore();
  }

  function drawFrame() {
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, w, h);

    // Smooth aperture radius interpolation
    if (prefersReducedMotion) {
      mouse.currentRadius = mouse.targetRadius;
    } else {
      mouse.currentRadius += (mouse.targetRadius - mouse.currentRadius) * 0.14;
    }

    // Draw the Black & White treated base layer
    ctx.drawImage(offscreenCanvas, 0, 0, w, h);

    // If active aperture, punch a hole in the Black & White layer to reveal underlying original color photo
    if (mouse.currentRadius > 1) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      const grad = ctx.createRadialGradient(
        mouse.x * dpr, mouse.y * dpr, mouse.currentRadius * 0.3 * dpr,
        mouse.x * dpr, mouse.y * dpr, mouse.currentRadius * dpr
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.75, 'rgba(0, 0, 0, 0.88)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x * dpr, mouse.y * dpr, mouse.currentRadius * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Subtle reticle outline around the color reveal lens
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(mouse.x * dpr, mouse.y * dpr, mouse.currentRadius * dpr, 0, Math.PI * 2);
      ctx.stroke();

      // Center crosshair marker
      ctx.strokeStyle = 'rgba(212, 75, 50, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(mouse.x * dpr - 7, mouse.y * dpr);
      ctx.lineTo(mouse.x * dpr + 7, mouse.y * dpr);
      ctx.moveTo(mouse.x * dpr, mouse.y * dpr - 7);
      ctx.lineTo(mouse.x * dpr, mouse.y * dpr + 7);
      ctx.stroke();

      ctx.restore();
    }

    // Continuous loop while active or animating
    if (!prefersReducedMotion && Math.abs(mouse.targetRadius - mouse.currentRadius) > 0.5) {
      animId = requestAnimationFrame(drawFrame);
    } else {
      animId = null;
    }
  }

  function startAnimation() {
    if (prefersReducedMotion) {
      mouse.currentRadius = mouse.targetRadius;
      drawFrame();
    } else if (!animId) {
      animId = requestAnimationFrame(drawFrame);
    }
  }

  function updatePointer(e) {
    const rect = container.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
    mouse.targetRadius = Math.min(rect.width, rect.height) * 0.44;
    startAnimation();
  }

  // Pointer & Touch Events
  container.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    isHovered = true;
    updatePointer(e);
  });

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    isHovered = true;
    updatePointer(e);
  });

  container.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return;
    isHovered = false;
    if (!isFocused && !touchRevealPinned) {
      mouse.targetRadius = 0;
      startAnimation();
    }
  });

  // Click is used for touch because some mobile browsers synthesize pointer events differently.
  container.addEventListener('click', (e) => {
    if (!isTouchInput || e.detail === 0) return;
    if (touchRevealPinned) {
      touchRevealPinned = false;
      mouse.targetRadius = 0;
      startAnimation();
    } else {
      updatePointer(e);
      touchRevealPinned = true;
    }
  });

  // Keyboard accessibility: Focus reveal
  container.setAttribute('tabindex', '0');
  container.setAttribute('role', 'region');
  updateInputMode();

  container.addEventListener('focus', () => {
    isFocused = true;
    const rect = container.getBoundingClientRect();
    mouse.x = rect.width / 2;
    mouse.y = rect.height / 2;
    mouse.targetRadius = Math.min(rect.width, rect.height) * 0.48;
    startAnimation();
  });

  container.addEventListener('blur', () => {
    isFocused = false;
    if (!isHovered) {
      mouse.targetRadius = 0;
      startAnimation();
    }
  });

  // Image load & fallback handling
  baseImg.onload = () => {
    imgLoaded = true;
    resizeCanvas();
  };

  baseImg.onerror = () => {
    // If portrait.jpg is missing or placeholder, seamlessly fall back to portrait.svg
    if (!baseImg.src.endsWith('portrait.svg')) {
      baseImg.src = 'public/assets/portrait.svg';
    }
  };

  if (baseImg.complete && baseImg.naturalWidth !== 0) {
    imgLoaded = true;
    resizeCanvas();
  }

  window.addEventListener('resize', () => {
    updateInputMode();
    resizeCanvas();
  });
}
