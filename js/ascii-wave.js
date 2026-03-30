/* ASCII Wave — constrained to hero title zone */
(function() {
  var canvas = document.getElementById('asciiWave');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var charSize = 12;
  var densityChars = " .'^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  var width, height, time = 0;
  var padLeft = 0, contentWidth = 0;
  var zoneTop = 0, zoneBottom = 0;

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    var containerWidth = Math.min(width, 1920);
    padLeft = Math.max(60, (width - containerWidth) / 2 + 60);
    contentWidth = width - padLeft * 2;

    // Find title position to constrain wave zone
    var title = document.querySelector('.hero__title');
    if (title) {
      var heroRect = canvas.parentElement.getBoundingClientRect();
      var titleRect = title.getBoundingClientRect();
      zoneTop = titleRect.top - heroRect.top;
      zoneBottom = titleRect.bottom - heroRect.top;
    } else {
      zoneTop = 80;
      zoneBottom = height - 80;
    }

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

    var c = Math.ceil(contentWidth / charSize);
    var zoneH = zoneBottom - zoneTop;
    var r = Math.ceil(zoneH / charSize);
    var fadeRows = 5;

    for (var y = 0; y < r; y++) {
      for (var x = 0; x < c; x++) {
        var normalizedY = (r - y) / r;
        var noiseVal = simpleNoise(x, y, time * 0.5);
        var mountainHeight = 0.7 + Math.sin(x * 0.05 + time * 0.1) * 0.1 +
                             Math.cos(x * 0.2) * 0.05;

        if (normalizedY < mountainHeight + noiseVal * 0.1) {
          var index = Math.floor(Math.abs(noiseVal) * densityChars.length);
          var char = densityChars[index % densityChars.length];
          var alpha = 1 - normalizedY * 1.5;

          // Fade bottom
          if (y > r - fadeRows) {
            alpha *= (r - y) / fadeRows;
          }
          // Fade top
          if (y < fadeRows) {
            alpha *= y / fadeRows;
          }

          if (alpha <= 0) continue;

          ctx.fillStyle = 'rgba(17, 47, 110, ' + Math.min(alpha, 0.5) + ')';
          ctx.fillText(char, padLeft + x * charSize + charSize / 2, zoneTop + y * charSize + charSize / 2);
        }
      }
    }

    time += 0.004;
    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener('resize', resize);
})();
