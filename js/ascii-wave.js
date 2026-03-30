/* ASCII Wave — hero background animation */
(function() {
  const canvas = document.getElementById('asciiWave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const chars = '01010110 IC FARVATER ЭКБ МИКРОСХЕМЫ РАЗЪЁМЫ СВЧ '.split('');
  const fontSize = 14;
  let cols, rows, time = 0;
  let animId;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    cols = Math.floor(canvas.width / (fontSize * 0.65));
    rows = Math.floor(canvas.height / fontSize);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px "Inter", monospace`;
    ctx.textBaseline = 'top';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Wave displacement
        const wave1 = Math.sin(x * 0.04 + time * 0.8) * 2;
        const wave2 = Math.sin(x * 0.02 - time * 0.5 + y * 0.1) * 1.5;
        const wave3 = Math.cos(y * 0.06 + time * 0.3) * 1;
        const displacement = wave1 + wave2 + wave3;

        // Opacity based on wave
        const baseOpacity = 0.06;
        const waveOpacity = (Math.sin(x * 0.03 + y * 0.05 + time * 0.6) + 1) * 0.04;
        const opacity = baseOpacity + waveOpacity + Math.max(0, displacement * 0.015);

        // Character selection
        const charIndex = Math.floor(Math.abs(Math.sin(x * 0.7 + y * 1.3 + time * 0.1)) * chars.length);
        const char = chars[charIndex % chars.length];

        const px = x * fontSize * 0.65;
        const py = y * fontSize + displacement * 4;

        ctx.fillStyle = `rgba(17, 47, 110, ${Math.min(opacity, 0.18)})`;
        ctx.fillText(char, px, py);
      }
    }

    time += 0.012;
    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener('resize', resize);

  // Pause when not visible
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) draw();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  });
  observer.observe(canvas);
})();
