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

/* Submenu: on narrow screens, scroll the current item into view */
(function () {
  var ul = document.querySelector('.pt-subnav ul');
  var cur = ul && ul.querySelector('[aria-current="page"]');
  if (!cur || ul.scrollWidth <= ul.clientWidth) return;
  ul.scrollLeft = Math.max(0, cur.offsetLeft - 16);
})();

/* Overview journey: Peri walks along the timeline and speaks for the active step.
   Auto-advances while the section is on screen; the panel's timer bar drives the pace. */
(function () {
  var root = document.querySelector('.jp');
  if (!root) return;
  var steps = Array.prototype.slice.call(root.querySelectorAll('.jp__step'));
  var bubble = root.querySelector('.jp__bubble');
  var label = root.querySelector('.jp__label');
  var say = root.querySelector('.jp__say');
  var go = root.querySelector('.jp__go');
  var goTxt = root.querySelector('.jp__go-txt');
  var timer = root.querySelector('.jp__timer');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wide = window.matchMedia('(min-width: 1001px)');
  var cur = 0, visible = false, hovering = false;

  steps.forEach(function (s, k) { s.setAttribute('role', 'tab'); s.setAttribute('aria-selected', k === 0); });

  function paint(i) {
    root.style.setProperty('--i', i);
    steps.forEach(function (s, k) {
      s.classList.toggle('is-on', k === i);
      s.classList.toggle('is-done', k < i);
      s.setAttribute('aria-selected', k === i);
      s.tabIndex = k === i ? 0 : -1;
    });
    var href = steps[i].getAttribute('data-href');
    if (href) { go.href = href; goTxt.textContent = 'Explore ' + steps[i].getAttribute('data-prod'); go.hidden = false; }
    else { go.hidden = true; }
  }
  var DUR = 5000, tid = null, started = 0, left = DUR;
  function arm(ms) { clearTimeout(tid); started = Date.now(); left = ms; tid = setTimeout(function () { show((cur + 1) % steps.length); }, ms); }
  function restartTimer() {
    clearTimeout(tid);
    root.classList.remove('is-playing');
    void timer.offsetWidth; // restart the bar animation
    if (visible && !reduce && wide.matches) {
      root.classList.add('is-playing');
      if (!hovering) arm(DUR); else left = DUR;
    }
  }
  function show(i) {
    if (i === cur) { restartTimer(); return; }
    cur = i; paint(i);
    bubble.classList.add('is-swapping');
    setTimeout(function () {
      label.textContent = steps[i].getAttribute('data-label');
      say.textContent = '\u201C' + steps[i].getAttribute('data-say') + '\u201D';
      bubble.classList.remove('is-swapping');
    }, 220);
    restartTimer();
  }

  steps.forEach(function (s, k) {
    s.addEventListener('mouseenter', function () { show(k); });
    s.addEventListener('click', function () { show(k); });
    s.addEventListener('focus', function () { show(k); });
    s.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (k + 1) % steps.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (k - 1 + steps.length) % steps.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = steps.length - 1;
      if (n !== null) { e.preventDefault(); steps[n].focus(); }
    });
  });
  root.addEventListener('mouseenter', function () {
    hovering = true; root.classList.add('is-paused');
    if (tid) { clearTimeout(tid); tid = null; left = Math.max(0, left - (Date.now() - started)); }
  });
  root.addEventListener('mouseleave', function () {
    hovering = false; root.classList.remove('is-paused');
    if (root.classList.contains('is-playing')) arm(left || DUR);
  });

  function check() {
    var r = root.getBoundingClientRect(), vh = window.innerHeight;
    var now = r.top < vh * 0.75 && r.bottom > vh * 0.25;
    if (now === visible) return;
    visible = now;
    if (visible) restartTimer(); else { root.classList.remove('is-playing'); clearTimeout(tid); }
  }
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  check();
  wide.addEventListener && wide.addEventListener('change', restartTimer);
  paint(0);
})();
