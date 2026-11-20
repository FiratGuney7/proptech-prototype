/* Design options switcher for the overview page (prototype only).
   Shows up when the URL carries ?hero=, ?journey= or ?options. */
(function () {
  var q = new URLSearchParams(location.search);
  if (!q.has('hero') && !q.has('journey') && !q.has('options')) return;
  var cur = { hero: q.get('hero') || 'a', journey: q.get('journey') || 'a' };
  var box = document.createElement('div');
  box.className = 'opt-switch';
  box.setAttribute('aria-label', 'Design options');
  function row(key, label) {
    return '<div><span>' + label + '</span>' + ['a', 'b', 'c'].map(function (v) {
      return '<button type="button" data-k="' + key + '" data-v="' + v + '" aria-pressed="' + (cur[key] === v) + '">' + v.toUpperCase() + '</button>';
    }).join('') + '</div>';
  }
  box.innerHTML = row('hero', 'Hero') + row('journey', 'Journey');
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    cur[b.getAttribute('data-k')] = b.getAttribute('data-v');
    document.documentElement.setAttribute('data-hero', cur.hero);
    document.documentElement.setAttribute('data-journey', cur.journey);
    box.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', cur[x.getAttribute('data-k')] === x.getAttribute('data-v')); });
    history.replaceState(null, '', '?hero=' + cur.hero + '&journey=' + cur.journey + location.hash);
    document.querySelectorAll('[data-v] .reveal, [data-v].reveal').forEach(function (r) { r.classList.add('is-in'); });
  });
  document.body.appendChild(box);
})();
