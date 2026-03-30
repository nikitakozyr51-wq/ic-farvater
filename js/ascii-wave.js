/* ASCII Wave — adapted from variant.com */
(function() {
  const canvas = document.getElementById('asciiWave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const charSize = 12;
  const densityChars = " .'^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  let width, height, time = 0;
  const mousePos = { x: -9999, y: -9999 };

  function cols() { return Math.ceil(width / charSize); }
  function rows() { return Math.ceil(height / charSize); }

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  function simpleNoise(x, y, t) {
    return Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t) +
           Math.sin(x * 0.01 - t) * Math.cos(y * 0.12) * 0.5;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.font = charSize + 'px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var c = cols(), r = rows();
    var rect = canvas.getBoundingClientRect();

    for (var y = 0; y < r; y++) {
      if (y < r * 0.4) continue;
      for (var x = 0; x < c; x++) {
        var posX = x * charSize;
        var posY = y * charSize;
        var dx = posX - mousePos.x;
        var dy = posY - (mousePos.y - rect.top);
        var dist = Math.sqrt(dx * dx + dy * dy);
        var normalizedY = (r - y) / r;
        var noiseVal = simpleNoise(x, y, time * 0.5);
        var mountainHeight = 0.3 + Math.sin(x * 0.05 + time * 0.1) * 0.1 +
                             Math.cos(x * 0.2) * 0.05;

        var char = '';
        var alpha = 0;

        if (normalizedY < mountainHeight + noiseVal * 0.1) {
          var index = Math.floor(Math.abs(noiseVal) * densityChars.length);
          char = densityChars[index % densityChars.length];
          alpha = 1 - normalizedY * 2;
        }

        if (dist < 150) {
          var lensStrength = 1 - dist / 150;
          if (Math.random() > 0.5) {
            char = Math.random() > 0.5 ? '0' : '1';
            ctx.fillStyle = 'rgba(17, 47, 110, ' + lensStrength + ')';
          } else {
            ctx.fillStyle = 'rgba(140, 150, 171, ' + alpha + ')';
          }
          var shiftX = (dx / dist) * 10 * lensStrength;
          var shiftY = (dy / dist) * 10 * lensStrength;
          ctx.fillText(char, posX + charSize / 2 - shiftX, posY + charSize / 2 - shiftY);
        } else if (char) {
          ctx.fillStyle = 'rgba(140, 150, 171, ' + alpha + ')';
          ctx.fillText(char, posX + charSize / 2, posY + charSize / 2);
        }
      }
    }

    time += 0.01;
    requestAnimationFrame(render);
  }

  canvas.addEventListener('mousemove', function(e) {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
  });

  canvas.addEventListener('mouseleave', function() {
    mousePos.x = -9999;
    mousePos.y = -9999;
  });

  resize();
  render();
  window.addEventListener('resize', resize);
})();
