/**
 * ASCII Canvas Animation — flowing characters with accent color
 * Inspired by the reference: noise-based character grid
 */
(function () {
  var canvas = document.getElementById('ascii-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var width, height;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*(){}[]<>?/~';
  var fontSize = 10;
  var columns, rows;
  var time = 0;
  var ACCENT = '#0033FF';

  function resize() {
    var rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    columns = Math.floor(width / fontSize);
    rows = Math.floor(height / fontSize);
    ctx.font = fontSize + 'px monospace';
  }

  resize();
  window.addEventListener('resize', resize);

  function noise(x, y, t) {
    return Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t) + Math.sin(x * 0.1 - t);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = ACCENT;
    ctx.textAlign = 'center';

    time += 0.02;

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < columns; x++) {
        var n = noise(x, y, time);

        if (n > 0.5 || n < -0.5) {
          var charIndex = Math.floor(Math.abs(n) * chars.length) % chars.length;
          ctx.globalAlpha = Math.max(0.08, Math.abs(n) * 0.6);
          ctx.fillText(chars[charIndex], x * fontSize + fontSize / 2, y * fontSize + fontSize);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  var running = true;

  function loop() {
    if (!running) return;
    draw();
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
