/* TEKCE Proptech prototype — minimal behaviour only.
   1) mobile menu  2) reveal-on-scroll  3) accessible tabs ([data-tabs]) */
(function () {
  document.documentElement.classList.add('js');

  // 1. Mobile menu
  var burger = document.querySelector('.tk-burger');
  if (burger) burger.addEventListener('click', function () {
    var head = burger.closest('.tk-header');
    var open = head.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });

  // 2. Reveal on scroll (skipped when reduced motion is preferred)
  var els = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // 3. Tabs: <div data-tabs> with [role=tab] buttons and [role=tabpanel] panels
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = root.querySelectorAll('[role="tab"]');
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); select(n);
      });
    });
  });
})();
