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

/* Platform page: preset filters. Result counts, search URLs and the first three
   listings of every combination were read from tekce.com on 20.11.2026 (#pf-find-data). */
(function () {
  var raw = document.getElementById('pf-find-data');
  var mock = document.querySelector('.pf-find__mock');
  var panel = document.querySelector('.pf-find');
  if (!raw || !mock || !panel) return;
  var data = JSON.parse(raw.textContent);
  var state = { loc: 'any', type: 'all', feat: 'none' };
  var LOC = { any: 'Select Location, e.g. Marbella', dubai: 'Dubai, United Arab Emirates', antalya: 'Antalya, Türkiye', istanbul: 'İstanbul, Türkiye',
    alicante: 'Alicante, Spain', malaga: 'Málaga, Spain', kyrenia: 'Kyrenia (Girne), North Cyprus' };
  var TYPE = { apartments: 'Apartments', houses: 'Houses', commercial: 'Commercial', land: 'Land' };
  var FEAT = { pool: 'Private pool', sea: 'Sea view', beach: 'Beachfront', newbuild: 'New build', inst: 'Buy in installments' };
  var img = function (n) { return '../../../assets/img/' + n; };
  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
  function card(ref) {
    var x = data.L[ref]; // [title, location, rooms, baths, price, currency, image, url]
    var from = x[2] && x[2].indexOf(',') > -1 ? '<small>From</small> ' : '';
    var specs = x[2] ? '<span><img src="' + img('room.svg') + '" alt="">' + esc(x[2]) + '</span><span><img src="' + img('shower.svg') + '" alt="">' + esc(x[3]) + '</span>' : '';
    return '<a class="tk-card" href="' + x[7] + '" target="_blank" rel="noopener" tabindex="-1">' +
      '<div class="tk-card__photo" style="background-image:url(\'' + x[6] + '\')"><span class="tk-card__ref">' + esc(ref) + '</span><span class="tk-card__star">☆</span></div>' +
      '<div class="tk-card__body"><h4>' + esc(x[0]) + '</h4><p class="tk-card__loc">' + esc(x[1]) + '</p><p class="tk-card__specs">' + specs + '</p>' +
      '<p class="tk-card__price">' + from + esc(x[4]) + ' <small>' + esc(x[5]) + '</small></p></div></a>';
  }
  function render() {
    var key = state.loc + '|' + state.type + '|' + state.feat;
    var r = data.R[key], url = data.U[key], n = Number(r[0]);
    var grid = mock.querySelector('.pf-find__grid');
    grid.classList.add('is-swapping');
    setTimeout(function () {
      grid.innerHTML = n ? r.slice(1).map(card).join('') : '<p class="pf-find__none">No properties match this search on tekce.com right now. Try another combination.</p>';
      grid.classList.remove('is-swapping');
    }, 160);
    mock.querySelector('.pf-find__count').textContent = Math.min(12, n) + ' of ' + n;
    mock.querySelector('.pf-find__url').textContent = url.replace('https://', '');
    var input = mock.querySelector('.pf-find__input');
    input.textContent = LOC[state.loc]; input.classList.toggle('is-set', state.loc !== 'any');
    var on = { loc: state.loc !== 'any', type: state.type !== 'all', ext: state.feat === 'pool', tag: state.feat !== 'none' && state.feat !== 'pool' };
    mock.querySelectorAll('[data-k]').forEach(function (s) { s.classList.toggle('on', !!on[s.getAttribute('data-k')]); });
    var chips = [];
    if (TYPE[state.type]) chips.push(TYPE[state.type]);
    if (FEAT[state.feat]) chips.push(FEAT[state.feat]);
    mock.querySelector('.tk-search__chosen').innerHTML = chips.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    var go = document.querySelector('.pf-find__go');
    go.href = url;
    go.querySelector('.pf-find__total').textContent = n.toLocaleString('en') + (n === 1 ? ' property' : ' properties');
  }
  ['loc', 'type', 'feat'].forEach(function (attr) {
    var btns = panel.querySelectorAll('[data-' + attr + ']');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        state[attr] = b.getAttribute('data-' + attr); render();
      });
    });
  });
  render();
})();
