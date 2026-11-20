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

/* Platform page: preset filters. Counts, URLs and the first three listings of
   each combination are read from #pf-find-data, taken from tekce.com on 20.11.2026. */
(function () {
  var raw = document.getElementById('pf-find-data');
  var mock = document.querySelector('.pf-find__mock');
  var panel = document.querySelector('.pf-find');
  if (!raw || !mock || !panel) return;
  var data = JSON.parse(raw.textContent);
  var state = { loc: 'any', villa: '0', pool: false, sea: false };
  var LOC = { any: 'Select Location, e.g. Marbella', antalya: 'Antalya, Türkiye', spain: 'Spain' };
  var img = function (n) { return '../../../assets/img/' + n; };
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function card(ref) {
    var x = data.listings[ref];
    var from = x.r && x.r.indexOf(',') > -1 ? '<small>From</small> ' : '';
    var specs = x.r ? '<span><img src="' + img('room.svg') + '" alt="">' + x.r + '</span><span><img src="' + img('shower.svg') + '" alt="">' + x.b + '</span>' : '';
    return '<a class="tk-card" href="' + x.url + '" target="_blank" rel="noopener" tabindex="-1">' +
      '<div class="tk-card__photo" style="background-image:url(\'' + x.img + '\')"><span class="tk-card__ref">' + ref + '</span><span class="tk-card__star">☆</span></div>' +
      '<div class="tk-card__body"><h4>' + esc(x.t) + '</h4><p class="tk-card__loc">' + esc(x.loc) + '</p><p class="tk-card__specs">' + specs + '</p>' +
      '<p class="tk-card__price">' + from + x.p + ' <small>' + x.c + '</small></p></div></a>';
  }
  function render() {
    var key = state.loc + state.villa + (state.pool ? '1' : '0') + (state.sea ? '1' : '0');
    var c = data.combos[key];
    var grid = mock.querySelector('.pf-find__grid');
    grid.classList.add('is-swapping');
    setTimeout(function () {
      grid.innerHTML = c.refs.map(card).join('');
      grid.classList.remove('is-swapping');
    }, 160);
    mock.querySelector('.pf-find__count').textContent = (c.n > 12 ? 12 : c.n) + ' of ' + c.n;
    mock.querySelector('.pf-find__url').textContent = c.url.replace('https://', '');
    var input = mock.querySelector('.pf-find__input');
    input.textContent = LOC[state.loc]; input.classList.toggle('is-set', state.loc !== 'any');
    var on = { loc: state.loc !== 'any', villa: state.villa === '1', pool: state.pool, sea: state.sea };
    mock.querySelectorAll('[data-k]').forEach(function (s) { s.classList.toggle('on', !!on[s.getAttribute('data-k')]); });
    var chips = [];
    if (state.villa === '1') chips.push('Villas & houses');
    if (state.pool) chips.push('Private pool');
    if (state.sea) chips.push('Sea view');
    mock.querySelector('.tk-search__chosen').innerHTML = chips.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    var go = document.querySelector('.pf-find__go');
    go.href = c.url;
    go.querySelector('.pf-find__total').textContent = Number(c.n).toLocaleString('en') + ' properties';
  }
  function group(attr, apply) {
    var btns = panel.querySelectorAll('[data-' + attr + ']');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        apply(b.getAttribute('data-' + attr)); render();
      });
    });
  }
  group('loc', function (v) { state.loc = v; });
  group('villa', function (v) { state.villa = v; });
  panel.querySelectorAll('[data-feat]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-feat'); state[f] = !state[f];
      b.setAttribute('aria-pressed', state[f]); render();
    });
  });
})();
