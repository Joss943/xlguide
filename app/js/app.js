/*
 * XLGuide — contrôleur : état de l'interface, routage, rendu et événements.
 * Les vues (js/views) sont des fonctions pures ; ce fichier est le seul à toucher au DOM.
 *
 * Routes (stables, utilisées par les favoris et les liens) :
 *   #/                 accueil            #/a/<activité>[/<niveau>]  parcours
 *   #/n/<id>  notion   #/f/<NOM> fonction  #/r/<id> méthode   #/e/<n> erreur
 *   #/outils  #/fn (index)  #/err  #/tr  #/kb  #/fav
 */
(function (XL) {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var ic = XL.icon;
  var model = XL.buildModel();
  var TOOL_VIEWS = ['tools', 'index', 'errors', 'tr', 'kb'];

  var S = XL.store;
  var state = {
    view: 'home', act: '', level: 'base', cat: '', type: '',
    q: '', sel: null, active: -1,
    ver: S.get('ver', '365', S.isText),         // contrôlée contre la liste des versions dans bindSettings
    favs: S.get('favs', [], S.isKeyList),
    done: S.get('done', [], S.isKeyList),       // notions terminées ('n:…')
    last: S.get('last', '', S.isText),          // dernière notion ouverte (bouton « Continuer »)
    focus: S.get('focus', false, S.isBool)      // mode concentration : la fiche seule, centrée
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
    function done() { toast('Copié'); }
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
    var page = [state.view, state.act, state.level, state.cat, state.type, state.q.trim()].join('|');
    var sig = page + '|' + state.ver + '|' + state.favs.join(',') + '|' + state.done.join(',');
    if (!force && sig === lastSig) { renderDetail(); return; }
    var samePage = page === lastPage, top = els.list.scrollTop;
    lastPage = page; lastSig = sig;

    var p = currentPage(), full = p.full !== undefined;
    document.querySelectorAll('#tabs a').forEach(function (a) {
      var on = a.getAttribute('data-tab') === currentTab();
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
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
    els.layout.classList.toggle('focus', !!ref && !full && state.focus);
    if (full) {
      els.detail.innerHTML = '';
    } else if (!ref) {
      var first = state.view === 'activity' && !searching() ? XL.progress.firstTodo(model, state.done, state.act, state.level) : null;
      els.detail.innerHTML = XL.views.emptySheet(ctx(), first);
    } else {
      rememberVisit(ref);
      uid = 0;
      els.detail.innerHTML = XL.views.sheet(ctx(), ref);
      els.detail.scrollTop = keep ? top : 0;
    }
    document.title = ref && !full ? (ref.item.title || ref.item.fr) + ' — XLGuide' : 'XLGuide — Apprendre à utiliser Excel';
    els.list.querySelectorAll('.item').forEach(function (el) {
      var on = el.getAttribute('data-key') === state.sel;
      el.classList.toggle('sel', on);
      var fold = on && el.closest('details');
      if (fold) fold.open = true; // élément sélectionné dans un groupe replié : on l'ouvre
    });
  }

  /* ------------------------------- progression ------------------------------- */
  function rememberVisit(ref) {
    if (ref.type !== 'nt' || state.last === ref.item.key) return;
    state.last = ref.item.key;
    XL.store.set('last', state.last);
  }
  function setDone(key, value) {
    var i = state.done.indexOf(key);
    if (value && i < 0) state.done.push(key);
    if (!value && i >= 0) state.done.splice(i, 1);
    XL.store.set('done', state.done);
  }
  /** « J'ai compris » : la notion est terminée, petit retour sur l'avancement, puis la suivante. */
  function completeNotion(key, go) {
    setDone(key, true);
    var n = model.resolve(key).item, st = XL.progress.stats(model, state.done, n.activity, n.level);
    toast(st.done === st.total ? 'Niveau « ' + model.levelById[n.level].label + ' » terminé.' :
      'Notion terminée. ' + st.done + ' sur ' + st.total + ' dans ce niveau.');
    if (go && go !== location.hash) location.hash = go; else render();
  }
  /** Remise à zéro en deux clics (pas de boîte de dialogue). */
  function resetProgress(button) {
    if (button.getAttribute('data-reset') !== 'confirm') {
      button.setAttribute('data-reset', 'confirm');
      button.textContent = 'Confirmer : tout remettre à zéro';
      return;
    }
    state.done = []; state.last = '';
    XL.store.set('done', []); XL.store.set('last', '');
    toast('Progression remise à zéro');
    render(true);
  }
  function toggleFocus() {
    state.focus = !state.focus;
    XL.store.set('focus', state.focus);
    renderDetail();
  }

  /** Onglets : accueil, les 4 activités (depuis le modèle), outils, favoris. */
  function renderTabs() {
    var tabs = [['home', '#/', 'Accueil']].concat(model.activities.map(function (a) { return [a.id, '#/a/' + a.id, a.label]; }));
    $('#tabs').innerHTML = tabs.map(function (t) {
      return '<a href="' + t[1] + '" data-tab="' + t[0] + '">' + XL.ui.esc(t[2]) + '</a>';
    }).join('') + '<span class="tab-sep" aria-hidden="true"></span>' +
      '<a href="#/outils" data-tab="outils">Outils</a>' +
      '<a href="#/fav" data-tab="fav">Favoris <small id="cFav"></small></a>';
  }
  function updateFavCount() { $('#cFav').textContent = state.favs.length || ''; }

  /* --------------------------------- routage --------------------------------- */
  function setView(view) {
    if (state.view !== view) state.cat = '';
    state.view = view;
  }

  /** La page affichée (hors recherche) contient-elle cet élément ? */
  function viewShows(ref) {
    var it = ref.item;
    switch (state.view) {
      case 'activity': return !!it.place && it.place.activity === state.act && it.place.level === state.level;
      case 'index': return ref.type === 'fn' && (!state.cat || it.cat === state.cat);
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
    if (state.view === 'index' && ref.type === 'fn') { state.cat = ''; return; }
    if (it.place) { setView('activity'); state.act = it.place.activity; state.level = it.place.level; }
    else setView(ref.type === 'err' ? 'errors' : 'index');
  }

  /** Adresse décodée ; une séquence %… mal formée (lien abîmé) mène à l'accueil au lieu de bloquer l'application. */
  function hashPath() {
    var raw = location.hash.replace(/^#\/?/, '');
    try { return decodeURIComponent(raw); } catch (e) { return ''; }
  }

  function route() {
    var parts = hashPath().split('/');
    var p0 = parts[0], rest = parts.slice(1).join('/');
    var ref = /^[frne]$/.test(p0) ? model.resolve(p0 + ':' + rest) : null;
    if (ref) { openSheet(ref); render(); return; }
    // Aller sur une page (onglet, fil d'Ariane, niveau) termine la recherche en cours.
    state.sel = null;
    if (state.q) { state.q = ''; els.q.value = ''; }
    var act = XL.routeAliases[parts[1]] || parts[1], level = XL.routeAliases[parts[2]] || parts[2];
    if (p0 === 'a' && model.actById[act]) {
      setView('activity');
      state.act = act;
      state.level = model.levelById[level] ? level : 'base';
    } else setView({ fn: 'index', err: 'errors', fav: 'fav', outils: 'tools', tr: 'tr', kb: 'kb' }[p0] || 'home');
    render();
  }

  function listHash() {
    if (state.view === 'activity') return '#/a/' + state.act + '/' + state.level;
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
      var src = (from === 'fr' ? fr.value : en.value).slice(0, 8192); // longueur maximale d'une formule Excel
      var r = XL.formula.translate(src, from === 'fr' ? 'fr2en' : 'en2fr');
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
    var q = state.q.trim(), saved = S.get('tr', '', S.isText);
    if (q.charAt(0) === '=') load(q); else if (saved) { fr.value = saved; run('fr'); }
    if (document.activeElement !== els.q) fr.focus(); // ne pas voler le focus de la barre de recherche
  }

  /* -------------------------------- événements -------------------------------- */
  function moveActive(step) {
    // seulement les cartes visibles (pas celles des groupes repliés)
    var items = Array.prototype.filter.call(els.list.querySelectorAll('.item'), function (el) { return el.offsetParent !== null; });
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
      return;
    }
    // ← → : notion précédente / suivante quand une notion est ouverte
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !typing && !e.altKey && !e.ctrlKey && !e.metaKey) {
      var link = els.detail.querySelector(e.key === 'ArrowRight' ? '[data-nav-next]' : '[data-nav-prev]');
      if (link) { e.preventDefault(); location.hash = link.getAttribute('href'); }
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
    var t = e.target.closest('[data-copy],[data-fav],[data-cat],[data-type],[data-q],[data-toggle-en],[data-back],[data-done],[data-undone],[data-focus],[data-reset]');
    if (!t) return;
    if (t.hasAttribute('data-done')) { e.preventDefault(); completeNotion(t.getAttribute('data-done'), t.getAttribute('data-go')); }
    else if (t.hasAttribute('data-undone')) { e.preventDefault(); setDone(t.getAttribute('data-undone'), false); render(); }
    else if (t.hasAttribute('data-focus')) { e.preventDefault(); toggleFocus(); }
    else if (t.hasAttribute('data-reset')) { e.preventDefault(); resetProgress(t); }
    else if (t.hasAttribute('data-copy')) { e.preventDefault(); copy(t.getAttribute('data-copy')); }
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
    var ver = $('#ver'), theme = $('#theme'), big = $('#big');
    function applyBig(on) {
      document.documentElement.classList.toggle('big', on);
      big.setAttribute('aria-pressed', String(on));
      big.classList.toggle('on', on);
    }
    applyBig(S.get('big', false, S.isBool));
    big.addEventListener('click', function () {
      var on = !document.documentElement.classList.contains('big');
      XL.store.set('big', on);
      applyBig(on);
      toast(on ? 'Texte agrandi' : 'Texte normal');
    });
    // Version enregistrée inconnue (ancienne ou corrompue) : retour à la version par défaut
    if (!Array.prototype.some.call(ver.options, function (o) { return o.value === state.ver; })) state.ver = '365';
    ver.value = state.ver;
    ver.addEventListener('change', function () { state.ver = ver.value; XL.store.set('ver', state.ver); render(true); toast('Version : Excel ' + state.ver); });
    document.documentElement.setAttribute('data-theme', S.get('theme', 'auto', S.isOneOf(['auto', 'light', 'dark'])));
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
