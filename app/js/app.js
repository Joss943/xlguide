/*
 * XLGuide — contrôleur : état de l'interface, routage, rendu et événements.
 * Les vues (js/views) sont des fonctions pures ; ce fichier est le seul à toucher au DOM.
 *
 * Routes (stables, utilisées par les favoris et les liens) :
 *   #/                 accueil            #/a/<activité>[/<niveau>]  parcours
 *   #/n/<id>  notion   #/f/<NOM> fonction  #/r/<id> méthode   #/e/<n> erreur
 *   #/outils  #/fn (index)  #/rx #/it (cas pratiques)  #/err  #/tr  #/kb  #/fav
 */
(function (XL) {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var ic = XL.icon;
  var model = XL.buildModel();
  var TOOL_VIEWS = ['tools', 'index', 'cases', 'errors', 'tr', 'kb'];

  var state = {
    view: 'home', act: '', level: 'base', domain: 'compta', cat: '', type: '',
    q: '', sel: null, active: -1,
    ver: XL.store.get('ver', '365'),
    favs: XL.store.get('favs', [])
  };
  var els = {}, lastPage = '', lastSig = '', shownSel = null, listItems = [], uid = 0;

  function ctx() {
    return { m: model, s: state, cfg: XL.config, uid: function () { return ++uid; } };
  }

  /* ------------------------------ retours visuels ------------------------------ */
  var toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove('show'); }, 1600);
  }
  function copy(text) {
    function done() { toast('Copié ✓'); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'offscreen';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Copie impossible'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext !== false) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  /* ---------------------------------- rendu ---------------------------------- */
  /** La recherche remplace la page, sauf sur les raccourcis (filtre) et le traducteur (formule collée). */
  function searching() {
    var q = state.q.trim();
    return !!q && state.view !== 'kb' && !(state.view === 'tr' && q.charAt(0) === '=');
  }
  function currentPage() {
    var c = ctx(), V = XL.views;
    if (searching()) return V.search(c);
    switch (state.view) {
      case 'activity': return V.activity(c, state.act, state.level);
      case 'index': return V.functionIndex(c);
      case 'cases': return V.cases(c, state.domain);
      case 'errors': return V.errors(c);
      case 'fav': return V.favorites(c);
      case 'tools': return { full: V.toolsHub(c) };
      case 'tr': return { full: V.translator(c), translator: true };
      case 'kb': return { full: V.shortcuts(c) };
      default: return { full: V.home(c) };
    }
  }
  function currentTab() {
    if (searching()) return '';
    if (state.view === 'activity') return state.act;
    return TOOL_VIEWS.indexOf(state.view) >= 0 ? 'outils' : state.view;
  }

  function render(force) {
    var page = [state.view, state.act, state.level, state.domain, state.cat, state.type, state.q.trim()].join('|');
    var sig = page + '|' + state.ver + '|' + state.favs.join(',');
    if (!force && sig === lastSig) { renderDetail(); return; }
    var samePage = page === lastPage, top = els.list.scrollTop;
    lastPage = page; lastSig = sig;

    var p = currentPage(), full = p.full !== undefined;
    document.querySelectorAll('#tabs a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-tab') === currentTab()); });
    els.layout.className = 'layout' + (full ? ' full' : '');
    els.side.innerHTML = full ? '' : p.side;
    els.list.innerHTML = full ? p.full : p.list;
    els.list.scrollTop = samePage ? top : 0;
    listItems = full ? [] : p.items;
    state.active = -1;
    if (p.translator) bindTranslator();
    renderDetail();
  }

  function renderDetail() {
    var ref = state.sel ? model.resolve(state.sel) : null;
    var full = els.layout.classList.contains('full');
    var keep = state.sel === shownSel, top = els.detail.scrollTop;
    shownSel = state.sel;
    els.layout.classList.toggle('has-detail', !!ref && !full);
    if (full) {
      els.detail.innerHTML = '';
    } else if (!ref) {
      els.detail.innerHTML = XL.views.emptySheet(ctx(), state.view === 'activity' && !searching() ? listItems[0] : null);
    } else {
      uid = 0;
      els.detail.innerHTML = XL.views.sheet(ctx(), ref);
      els.detail.scrollTop = keep ? top : 0;
    }
    document.title = ref && !full ? (ref.item.title || ref.item.fr) + ' — XLGuide' : 'XLGuide — Formules Excel en français';
    els.list.querySelectorAll('.item').forEach(function (el) { el.classList.toggle('sel', el.getAttribute('data-key') === state.sel); });
  }

  /** Onglets : accueil, les 4 activités (depuis le modèle), outils, favoris. */
  function renderTabs() {
    var tabs = [['home', '#/', 'home', 'Accueil']].concat(model.activities.map(function (a) {
      return [a.id, '#/a/' + a.id, a.icon, a.label];
    }));
    $('#tabs').innerHTML = tabs.map(function (t) {
      return '<a href="' + t[1] + '" data-tab="' + t[0] + '">' + ic(t[2]) + XL.ui.esc(t[3]) + '</a>';
    }).join('') + '<span class="tab-sep" aria-hidden="true"></span>' +
      '<a href="#/outils" data-tab="outils">' + ic('bolt') + 'Outils</a>' +
      '<a href="#/fav" data-tab="fav">' + ic('star') + 'Favoris <small id="cFav"></small></a>';
  }
  function updateFavCount() { $('#cFav').textContent = state.favs.length || ''; }

  /* --------------------------------- routage --------------------------------- */
  function setView(view, domain) {
    if (state.view !== view || (domain && state.domain !== domain)) state.cat = '';
    state.view = view;
    if (domain) state.domain = domain;
  }

  /** La page affichée (hors recherche) contient-elle cet élément ? */
  function viewShows(ref) {
    var it = ref.item;
    switch (state.view) {
      case 'activity': return !!it.place && it.place.activity === state.act && it.place.level === state.level;
      case 'index': return ref.type === 'fn' && (!state.cat || it.cat === state.cat);
      case 'cases': return ref.type === 'rx' && it.domain === state.domain && (!state.cat || it.cat === state.cat);
      case 'errors': return ref.type === 'err';
      case 'fav': return state.favs.indexOf(it.key) >= 0;
      default: return false;
    }
  }

  /** Ouvre une fiche : garde la page affichée si elle la contient, sinon va à l'emplacement naturel de l'élément. */
  function openSheet(ref) {
    var it = ref.item;
    state.sel = it.key;
    if (searching() || viewShows(ref)) return;
    if ((state.view === 'index' && ref.type === 'fn') || (state.view === 'cases' && it.domain === state.domain)) { state.cat = ''; return; }
    if (it.place) { setView('activity'); state.act = it.place.activity; state.level = it.place.level; }
    else if (ref.type === 'fn') setView('index');
    else if (ref.type === 'rx') setView('cases', it.domain);
    else setView('errors');
  }

  function route() {
    var parts = decodeURIComponent(location.hash.replace(/^#\/?/, '')).split('/');
    var p0 = parts[0], rest = parts.slice(1).join('/');
    var ref = /^[frne]$/.test(p0) ? model.resolve(p0 + ':' + rest) : null;
    if (ref) { openSheet(ref); render(); return; }
    // Aller sur une page (onglet, fil d'Ariane, niveau) termine la recherche en cours.
    state.sel = null;
    if (state.q) { state.q = ''; els.q.value = ''; }
    if (p0 === 'a' && model.actById[parts[1]]) {
      setView('activity');
      state.act = parts[1];
      state.level = model.levelById[parts[2]] ? parts[2] : 'base';
    } else if (p0 === 'rx' || p0 === 'it') setView('cases', p0 === 'it' ? 'it' : 'compta');
    else setView({ fn: 'index', err: 'errors', fav: 'fav', outils: 'tools', tr: 'tr', kb: 'kb' }[p0] || 'home');
    render();
  }

  function listHash() {
    if (state.view === 'activity') return '#/a/' + state.act + '/' + state.level;
    if (state.view === 'cases') return state.domain === 'it' ? '#/it' : '#/rx';
    return { index: '#/fn', errors: '#/err', fav: '#/fav' }[state.view] || '#/';
  }
  /** Ferme la fiche sans quitter la liste affichée (résultats de recherche compris). */
  function closeSheet() {
    state.sel = null;
    history.pushState(null, '', listHash());
    render();
  }

  /** Nouvelle recherche ; quand elle est vidée, la fiche ouverte reste visible dans sa page naturelle. */
  function setQuery(q) {
    state.q = q;
    state.type = '';
    var ref = !searching() && state.sel ? model.resolve(state.sel) : null;
    if (ref) openSheet(ref);
    render();
  }

  /* ------------------------------- traducteur ------------------------------- */
  function bindTranslator() {
    var fr = $('#trFr'), en = $('#trEn'), warn = $('#trWarn'), fns = $('#trFns'), dir = $('#trDir');
    function run(from) {
      var r = XL.formula.translate(from === 'fr' ? fr.value : en.value, from === 'fr' ? 'fr2en' : 'en2fr');
      (from === 'fr' ? en : fr).value = r.result;
      dir.innerHTML = ic(from === 'fr' ? 'chevron-right' : 'arrow-left');
      warn.innerHTML = XL.ui.tips(r.warnings, true);
      var used = XL.formula.functionsUsed(fr.value).filter(function (n) { return model.fnByName[n]; });
      fns.innerHTML = used.length ? '<span class="muted">Fonctions :</span>' + XL.ui.fnChips(model, used, state.ver) : '';
      XL.store.set('tr', fr.value);
    }
    function load(formula) {
      if (XL.formula.detect(formula) === 'fr') { fr.value = formula; run('fr'); } else { en.value = formula; run('en'); }
    }
    fr.addEventListener('input', function () { run('fr'); });
    en.addEventListener('input', function () { run('en'); });
    $('#trCopyFr').addEventListener('click', function () { copy(fr.value); });
    $('#trCopyEn').addEventListener('click', function () { copy(en.value); });
    els.list.querySelectorAll('[data-sample]').forEach(function (b) {
      b.addEventListener('click', function () { load(b.getAttribute('data-sample')); });
    });
    var q = state.q.trim(), saved = XL.store.get('tr', '');
    if (q.charAt(0) === '=') load(q); else if (saved) { fr.value = saved; run('fr'); }
    if (document.activeElement !== els.q) fr.focus(); // ne pas voler le focus de la barre de recherche
  }

  /* -------------------------------- événements -------------------------------- */
  function moveActive(step) {
    var items = els.list.querySelectorAll('.item');
    if (!items.length) return;
    state.active = Math.max(0, Math.min(items.length - 1, state.active + step));
    items.forEach(function (el, i) { el.classList.toggle('kb-active', i === state.active); });
    var el = items[state.active];
    el.scrollIntoView({ block: 'nearest' });
    history.replaceState(null, '', el.getAttribute('href'));
    state.sel = el.getAttribute('data-key');
    renderDetail();
  }

  function onKey(e) {
    var tag = (e.target.tagName || '').toLowerCase(), typing = tag === 'input' || tag === 'textarea' || tag === 'select';
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault(); els.q.focus(); els.q.select(); return;
    }
    if (e.key === 'Escape') {
      if (els.q.value) { els.q.value = ''; setQuery(''); els.q.focus(); } else if (state.sel) closeSheet();
      return;
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && (!typing || e.target === els.q)) {
      e.preventDefault(); moveActive(e.key === 'ArrowDown' ? 1 : -1);
    }
  }

  function toggleFav(key) {
    var i = state.favs.indexOf(key);
    if (i >= 0) state.favs.splice(i, 1); else state.favs.unshift(key);
    XL.store.set('favs', state.favs);
    updateFavCount();
    toast(i >= 0 ? 'Retiré des favoris' : 'Ajouté aux favoris');
    render(); // étoiles de la liste et bouton de la fiche ; positions de défilement conservées
  }

  function onClick(e) {
    var t = e.target.closest('[data-copy],[data-fav],[data-cat],[data-type],[data-q],[data-toggle-en],[data-back]');
    if (!t) return;
    if (t.hasAttribute('data-copy')) { e.preventDefault(); copy(t.getAttribute('data-copy')); }
    else if (t.hasAttribute('data-fav')) { e.preventDefault(); toggleFav(t.getAttribute('data-fav')); }
    else if (t.hasAttribute('data-back')) { e.preventDefault(); closeSheet(); }
    else if (t.hasAttribute('data-toggle-en')) {
      var el = document.getElementById(t.getAttribute('data-toggle-en'));
      if (el) { el.hidden = !el.hidden; t.classList.toggle('on', !el.hidden); }
    } else if (t.hasAttribute('data-q')) {
      e.preventDefault(); els.q.value = t.getAttribute('data-q'); setQuery(els.q.value); els.q.focus();
    } else if (t.hasAttribute('data-type')) { state.type = t.getAttribute('data-type'); render(); }
    else if (t.hasAttribute('data-cat')) { state.cat = t.getAttribute('data-cat'); render(); }
  }

  function bindSearch() {
    var timer;
    els.q.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { setQuery(els.q.value); }, 70);
    });
    els.q.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var target = els.list.querySelector('.item.kb-active') || els.list.querySelector('.item');
      if (target) location.hash = target.getAttribute('href');
    });
  }

  function isDark() {
    var cur = document.documentElement.getAttribute('data-theme');
    return cur === 'dark' || (cur === 'auto' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function bindSettings() {
    var ver = $('#ver'), theme = $('#theme');
    ver.value = state.ver;
    ver.addEventListener('change', function () { state.ver = ver.value; XL.store.set('ver', state.ver); render(true); toast('Version : Excel ' + state.ver); });
    document.documentElement.setAttribute('data-theme', XL.store.get('theme', 'auto'));
    theme.innerHTML = ic(isDark() ? 'sun' : 'moon');
    theme.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      XL.store.set('theme', next);
      theme.innerHTML = ic(isDark() ? 'sun' : 'moon');
    });
  }

  /* ------------------------------ environnement ------------------------------ */
  function setupEnv() {
    var desktop = !!window.xlguideDesktop;
    var standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    if (!desktop && !standalone && location.protocol.indexOf('http') === 0) $('#install').hidden = false;
    if (desktop) document.documentElement.classList.add('desktop');
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !desktop) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* hors-ligne indisponible */ });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    els = { layout: $('#layout'), side: $('#side'), list: $('#list'), detail: $('#detail'), q: $('#q'), toast: $('#toast') };
    renderTabs();
    document.querySelectorAll('i[data-ic]').forEach(function (el) { el.outerHTML = ic(el.getAttribute('data-ic')); });
    updateFavCount();
    bindSearch(); bindSettings(); setupEnv();
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', route);
    route();
    if (state.view === 'home') els.q.focus();
  });
})(window.XL);
