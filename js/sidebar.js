// Sidebar radio/filter interactivity
(function() {
  'use strict';

  // Sort group — single select (radio behavior)
  function initSortGroup(col) {
    var radios = col.querySelectorAll('.sidebar__radio');
    radios.forEach(function(btn) {
      btn.addEventListener('click', function() {
        radios.forEach(function(r) { r.classList.remove('sidebar__radio--active'); });
        btn.classList.add('sidebar__radio--active');
      });
    });
  }

  // Category group (right column) — single select, no bullets
  function initCategoryGroup(col) {
    var radios = col.querySelectorAll('.sidebar__radio');
    radios.forEach(function(btn) {
      btn.addEventListener('click', function() {
        radios.forEach(function(r) { r.classList.remove('sidebar__radio--active'); });
        btn.classList.add('sidebar__radio--active');
      });
    });
  }

  // Filter groups (применение, производитель, корпус) — toggle behavior
  function initFilterGroup(group) {
    var radios = group.querySelectorAll('.sidebar__radio');
    radios.forEach(function(btn) {
      btn.addEventListener('click', function() {
        btn.classList.toggle('sidebar__radio--active');
        updateClearButton(group);
      });
    });

    var clearBtn = group.querySelector('.sidebar__clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        radios.forEach(function(r) { r.classList.remove('sidebar__radio--active'); });
        updateClearButton(group);
      });
    }
  }

  function updateClearButton(group) {
    var sidebar = group.closest('.catalog__sidebar') || group;
    var count = sidebar.querySelectorAll('.sidebar__radio--active').length;
    var countEl = document.getElementById('sidebar-count');
    if (countEl) countEl.textContent = count;
  }

  function init() {
    var sidebar = document.getElementById('catalog-sidebar');
    if (!sidebar) return;

    var splitGroup = sidebar.querySelector('.sidebar__group--split');
    if (splitGroup) {
      var cols = splitGroup.querySelectorAll('.sidebar__col');
      if (cols[0]) initSortGroup(cols[0]);
      if (cols[1]) initCategoryGroup(cols[1]);
    }

    var groups = sidebar.querySelectorAll('.sidebar__group:not(.sidebar__group--split)');
    groups.forEach(function(group) {
      initFilterGroup(group);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
