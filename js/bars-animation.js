/**
 * Bars Animation — Base.org inspired
 * Vertical candlestick bars arranged in a circle, pulsing
 */
(function () {
  var canvas = document.getElementById('bars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var size = 320;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    size = Math.min(rect.width, rect.height);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  // Bar config
  var COLS = 21;
  var ROWS = 21;
  var ACCENT = '#156BD6';
  var GRAY = '#B0B0B0';
  var GRAY_LIGHT = '#D0D0D0';

  // Pre-generate bar properties
  var bars = [];
  var cx = 0.5;
  var cy = 0.5;
  var radius = 0.38;

  for (var row = 0; row < ROWS; row++) {
    for (var col = 0; col < COLS; col++) {
      var nx = col / (COLS - 1);
      var ny = row / (ROWS - 1);
      var dx = nx - cx;
      var dy = ny - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > radius + 0.04) continue;

      var isAccent = (dist < radius * 0.75) && (Math.random() > 0.45);
      var phase = Math.random() * Math.PI * 2;
      var speed = 0.3 + Math.random() * 0.7;
      var baseHeight = 0.3 + Math.random() * 0.5;
      var amplitude = 0.15 + Math.random() * 0.35;

      // Edge bars are shorter
      if (dist > radius * 0.8) {
        baseHeight *= 0.5;
        amplitude *= 0.4;
      }

      bars.push({
        x: nx,
        y: ny,
        dist: dist,
        isAccent: isAccent,
        phase: phase,
        speed: speed,
        baseHeight: baseHeight,
        amplitude: amplitude,
        bodyRatio: 0.25 + Math.random() * 0.35
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, size, size);

    var cellW = size / COLS;
    var barW = cellW * 0.28;
    var bodyW = cellW * 0.55;

    for (var i = 0; i < bars.length; i++) {
      var b = bars[i];
      var px = b.x * size;
      var py = b.y * size;

      var h = b.baseHeight + Math.sin(t * b.speed + b.phase) * b.amplitude;
      h = Math.max(0.1, Math.min(1, h));

      var totalH = h * cellW * 1.8;
      var bodyH = totalH * b.bodyRatio;
      var wickTop = (totalH - bodyH) * 0.6;
      var wickBot = (totalH - bodyH) * 0.4;

      var topY = py - wickTop - bodyH / 2;
      var botY = py + wickBot + bodyH / 2;

      var color = b.isAccent ? ACCENT : GRAY;
      var wickColor = b.isAccent ? ACCENT : GRAY_LIGHT;

      // Wick (thin line)
      ctx.beginPath();
      ctx.moveTo(px, topY);
      ctx.lineTo(px, botY);
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = barW * 0.4;
      ctx.stroke();

      // Body (thicker rectangle)
      var bodyTop = py - bodyH / 2;
      ctx.fillStyle = color;
      ctx.fillRect(px - bodyW / 2, bodyTop, bodyW, bodyH);
    }
  }

  var startTime = performance.now();
  var running = true;

  function loop() {
    if (!running) return;
    var t = (performance.now() - startTime) / 1000;
    draw(t);
    requestAnimationFrame(loop);
  }

  // Only animate when visible
  var observer = new IntersectionObserver(function (entries) {
    running = entries[0].isIntersecting;
    if (running) loop();
  }, { threshold: 0.1 });

  observer.observe(canvas);
  loop();
})();
