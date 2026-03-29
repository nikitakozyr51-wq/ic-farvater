(function () {
  var canvas = document.getElementById('footer-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: false });
  var CELL = 10;
  var cols, rows, time = 0;
  var chars = ['@', '#', '&', '%', '*', '+', '=', '-', ':', '.', ' '];
  var startTime = Date.now() + 800;

  var cpuMatrix = [
    [0,0,1,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,1,0],
    [1,1,0,0,0,0,0,1,1],
    [0,1,0,1,1,1,0,1,0],
    [1,1,0,1,1,1,0,1,1],
    [0,1,0,1,1,1,0,1,0],
    [1,1,0,0,0,0,0,1,1],
    [0,1,1,1,1,1,1,1,0],
    [0,0,1,0,1,0,1,0,0]
  ];

  var cpuBlocks = [];
  for (var y = 8; y >= 0; y--) {
    for (var x = 0; x < 9; x++) {
      if (cpuMatrix[y][x] === 1) {
        cpuBlocks.push({ dx: x - 4, dy: y - 10, t: (8 - y) * 0.08 + x * 0.01 });
      }
    }
  }

  /* Position CPU between col 3 (Contacts) and col 4 (Products) of footer grid.
     Container: max 1440px, padding 120px each side → content 1200px.
     4 equal cols with 48px gaps → col width = (1200-144)/4 = 264px.
     Gap center between col3 and col4: 120 + 264*3 + 48*2.5 = 1032px from container left. */
  function getCpuCol() {
    var containerMax = 1440;
    var containerPad = 120;
    var vw = canvas.width;
    var containerW = Math.min(vw, containerMax);
    var containerLeft = (vw - containerW) / 2;
    var cpuX = containerLeft + containerPad + 264 * 3 + 48 * 2.5;
    return Math.floor(cpuX / CELL);
  }

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    cols = Math.ceil(canvas.width / CELL);
    rows = Math.ceil(canvas.height / CELL);
    ctx.font = CELL + 'px "VT323", monospace';
    ctx.textBaseline = 'top';
  }

  function noise(x, y, t) {
    return Math.sin(x * 0.1 + t) + Math.cos(y * 0.1 - t);
  }

  function draw() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var now = Date.now();
    var progress = 0;
    if (now > startTime) {
      progress = Math.min((now - startTime) / 8000, 1.0);
    }

    var baseSoil = Math.floor(rows * 0.7);
    var cx = getCpuCol();

    for (var x = 0; x < cols; x++) {
      var surfOff = Math.sin(x * 0.1 + time * 0.02) * 2;
      var colSurf = Math.floor(baseSoil + surfOff);
      for (var y = colSurf; y < rows; y++) {
        var depth = y - colSurf;
        var flow = noise(x, y, time * 0.03);
        var ci = Math.floor(depth * 0.5 + flow * 2 + 2);
        ci = Math.max(0, Math.min(ci, chars.length - 2));
        ctx.fillStyle = depth < 2 ? '#555' : depth < 6 ? '#333' : '#111';
        ctx.fillText(chars[ci], x * CELL, y * CELL);
      }
    }

    var surfCenter = Math.floor(baseSoil + Math.sin(cx * 0.1 + time * 0.02) * 2);

    if (progress > 0.1) {
      var wr = 7, dr = 2;
      for (var dx = -wr; dx <= wr; dx++) {
        for (var dy = -2; dy <= 3; dy++) {
          if ((dx * dx) / (wr * wr) + (dy * dy) / (dr * dr) <= 1) {
            ctx.fillStyle = '#000000';
            ctx.fillRect((cx + dx) * CELL, (surfCenter + dy) * CELL, CELL, CELL);
          }
        }
      }
    }

    if (progress > 0) {
      ctx.fillStyle = '#FFFFFF';
      cpuBlocks.forEach(function (b) {
        if (progress >= b.t) {
          var sway = b.dy < -4 ? Math.round(Math.sin(time * 0.03 + b.dy * 0.1) * 0.6) : 0;
          ctx.fillRect((cx + b.dx + sway) * CELL + 1, (surfCenter + b.dy) * CELL + 1, CELL - 2, CELL - 2);
        }
      });
    }

    time++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
