/* IC Фарватер — Бренд-бук · интерактив (vanilla, без зависимостей) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { showToast('Скопировано: ' + text); },
        function () { fallbackCopy(text); }
      );
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('Скопировано: ' + text); } catch (e) { showToast(text); }
    document.body.removeChild(ta);
  }

  /* ---------- Click-to-copy (свотчи, тип-строки) ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function () { copy(el.getAttribute('data-copy')); });
  });

  /* ---------- Scrollspy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.bb-nav__link'));
  var map = {};
  links.forEach(function (l) {
    var id = l.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) map[id] = l;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var active = map[e.target.id];
        if (active) active.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });

  /* ---------- Fade-up on scroll ---------- */
  var fx = document.querySelectorAll('[data-fx]');
  if (reduce) {
    fx.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    fx.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var scrim = document.getElementById('scrim');
  function closeNav() { if (nav) nav.classList.remove('open'); if (scrim) scrim.classList.remove('show'); }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
      if (scrim) scrim.classList.toggle('show');
    });
  }
  if (scrim) scrim.addEventListener('click', closeNav);
  links.forEach(function (l) { l.addEventListener('click', closeNav); });

  /* ---------- Accordion demo (как на живом сайте) ---------- */
  var acc = document.getElementById('accDemo');
  if (acc) {
    acc.querySelectorAll('.demo-acc__head').forEach(function (head) {
      head.addEventListener('click', function () {
        head.parentElement.classList.toggle('is-open');
      });
    });
  }

  /* ---------- Radio demo ---------- */
  var radio = document.getElementById('radioDemo');
  if (radio) {
    radio.querySelectorAll('.demo-radio').forEach(function (r) {
      r.addEventListener('click', function () {
        radio.querySelectorAll('.demo-radio').forEach(function (x) { x.classList.remove('is-active'); });
        r.classList.add('is-active');
      });
    });
  }

  /* ---------- Marker ( ) → (•) demo ---------- */
  var marker = document.getElementById('markerDemo');
  if (marker && !reduce) {
    var on = false;
    setInterval(function () { on = !on; marker.textContent = on ? '(•)' : '( )'; }, 1100);
  }

  /* ---------- Space scale viz ---------- */
  var scaleHost = document.getElementById('spacescale');
  if (scaleHost) {
    [4, 8, 12, 16, 24, 32, 48, 64, 80, 120].forEach(function (v) {
      var item = document.createElement('div');
      item.className = 'bb-spacescale__item';
      item.innerHTML = '<div class="bb-spacescale__bar" style="height:' + v + 'px"></div>' +
        '<div class="bb-spacescale__lbl">' + v + '</div>';
      scaleHost.appendChild(item);
    });
  }

  /* ---------- 12-col grid overlay ---------- */
  var cols = document.getElementById('gridcols');
  if (cols) {
    for (var i = 0; i < 12; i++) {
      var c = document.createElement('div');
      c.className = 'bb-gridbox__col';
      cols.appendChild(c);
    }
  }
  var gToggle = document.getElementById('gridToggle');
  var gBox = document.getElementById('gridbox');
  if (gToggle && gBox) {
    gToggle.addEventListener('click', function () {
      var on = gBox.classList.toggle('show-cols');
      gToggle.classList.toggle('is-on', on);
      gToggle.textContent = on ? 'Скрыть 12-колоночную сетку' : 'Показать 12-колоночную сетку';
    });
  }
})();
