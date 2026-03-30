/* ASCII Wave — hero background animation */
(function() {
  const canvas = document.getElementById('asciiWave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const chars = '01010110 IC FARVATER ЭКБ МИКРОСХЕМЫ РАЗЪЁМЫ СВЧ '.split('');
  const fontSize = 14;
  let cols, rows, time = 0;
  let animId = null;

  function resize() {
    const parent = canvas.parentElement;
    const w = parent.offsetWidth || window.innerWidth;
    const h = parent.offsetHeight || 400;
    canvas.width = w;
    canvas.height = h;
    cols = Math.floor(w / (fontSize * 0.65));
    rows = Math.floor(h / fontSize);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px Inter, monospace';
    ctx.textBaseline = 'top';

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var wave1 = Math.sin(x * 0.04 + time * 0.8) * 2;
        var wave2 = Math.sin(x * 0.02 - time * 0.5 + y * 0.1) * 1.5;
        var wave3 = Math.cos(y * 0.06 + time * 0.3) * 1;
        var displacement = wave1 + wave2 + wave3;

        var baseOpacity = 0.12;
        var waveOpacity = (Math.sin(x * 0.03 + y * 0.05 + time * 0.6) + 1) * 0.06;
        var opacity = baseOpacity + waveOpacity + Math.max(0, displacement * 0.02);
        if (opacity > 0.3) opacity = 0.3;

        var charIndex = Math.floor(Math.abs(Math.sin(x * 0.7 + y * 1.3 + time * 0.1)) * chars.length);
        var char = chars[charIndex % chars.length];

        var px = x * fontSize * 0.65;
        var py = y * fontSize + displacement * 4;

        ctx.fillStyle = 'rgba(17, 47, 110, ' + opacity + ')';
        ctx.fillText(char, px, py);
      }
    }

    time += 0.012;
    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();
