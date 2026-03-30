/* ASCII Wave — variant.com style, constrained to container grid */
(function() {
  var canvas = document.getElementById('asciiWave');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var charSize = 12;
  var densityChars = " .'^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  var width, height, time = 0;
  var padLeft = 0, padRight = 0, contentWidth = 0;

  function cols() { return Math.ceil(contentWidth / charSize); }
  function rows() { return Math.ceil(height / charSize); }

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    // Match container padding (60px on each side, max 1920px)
    var containerWidth = Math.min(width, 1920);
    padLeft = Math.max(60, (width - containerWidth) / 2 + 60);
    padRight = padLeft;
    contentWidth = width - padLeft - padRight;

    var dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    for (var y = 0; y < r; y++) {
      for (var x = 0; x < c; x++) {
        var normalizedY = (r - y) / r;
        var noiseVal = simpleNoise(x, y, time * 0.5);
        var mountainHeight = 0.35 + Math.sin(x * 0.05 + time * 0.1) * 0.1 +
                             Math.cos(x * 0.2) * 0.05;

        if (normalizedY < mountainHeight + noiseVal * 0.1) {
          var index = Math.floor(Math.abs(noiseVal) * densityChars.length);
          var char = densityChars[index % densityChars.length];
          var alpha = 1 - normalizedY * 2;

          // Fade out at the bottom edge
          var rowFromBottom = r - y;
          var fadeRows = 6;
          if (rowFromBottom < fadeRows) {
            alpha *= rowFromBottom / fadeRows;
          }

          if (alpha <= 0) continue;

          ctx.fillStyle = 'rgba(17, 47, 110, ' + Math.max(0, alpha) + ')';
          ctx.fillText(char, padLeft + x * charSize + charSize / 2, y * charSize + charSize / 2);
        }
      }
    }

    time += 0.01;
    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener('resize', resize);
})();
