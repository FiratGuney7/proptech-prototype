/* Platform page: language / currency / unit preview for listing ALC-00869.
   Data (titles, labels, converted prices, distances) is read from #pf-loc-data,
   all taken from tekce.com on 19.11.2026. */
(function () {
  var root = document.querySelector('.pf-loc');
  var raw = document.getElementById('pf-loc-data');
  if (!root || !raw) return;
  var data = JSON.parse(raw.textContent);
  var state = { lang: 'en', cur: 'EUR', unit: 'metric' };
  var $ = function (sel) { return root.querySelector(sel); };

  function render() {
    var L = data.langs[state.lang];
    var title = $('.pf-loc__title');
    title.textContent = L.title; title.lang = state.lang; title.dir = L.dir;
    var label = $('.pf-loc__label');
    label.textContent = L.label; label.lang = state.lang;
    $('.pf-loc__price').dir = L.dir;
    $('.pf-loc__amt').textContent = data.cur[state.cur];
    $('.pf-loc__cur').textContent = state.cur;
    $('.pf-loc__beach b').textContent = data.units[state.unit][0];
    $('.pf-loc__air b').textContent = data.units[state.unit][1];
    var go = $('.pf-loc__go');
    go.href = L.url;
    $('.pf-loc__goname').textContent = L.name + ' · ' + state.cur;
  }

  function bind(attr, key) {
    var btns = root.querySelectorAll('[data-' + attr + ']');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        state[key] = b.getAttribute('data-' + attr);
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        render();
      });
    });
  }
  bind('lang', 'lang'); bind('cur', 'cur'); bind('unit', 'unit');
  render();
})();
