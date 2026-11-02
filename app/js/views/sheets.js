/*
 * Fiches (panneau de droite) : notion, fonction, méthode, erreur.
 * Organisation pédagogique : l'essentiel d'abord, le détail ensuite, le reste replié.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var ui = XL.ui, esc = ui.esc, ic = ui.ic;
  var views = (XL.views = XL.views || {});

  function topBar(ctx, item) {
    return '<div class="d-top"><button class="back" data-back title="Retour">' + ic('arrow-left') + '</button>' + ui.crumbs(ctx.m, item) +
      '<button class="fav-btn' + (ctx.s.favs.indexOf(item.key) >= 0 ? ' on' : '') + '" data-fav="' + esc(item.key) + '" title="Ajouter aux favoris">' + ic('star') + '</button></div>';
  }
  function section(title, body, cls) {
    return body ? '<section class="block' + (cls ? ' ' + cls : '') + '"><h3>' + title + '</h3>' + body + '</section>' : '';
  }
  function more(summary, body) {
    return body ? '<details class="block more"><summary>' + summary + '</summary>' + body + '</details>' : '';
  }
  function examples(ctx, list, fnName) {
    return list.map(function (e) {
      return ui.formulaBlock(e[0], { explain: e[1], expected: e.length > 2 ? e[2] : undefined, fnName: fnName, uid: ctx.uid() });
    }).join('');
  }
  function count(n, one, many) { return n + ' ' + (n > 1 ? many : one); }

  /* ------------------------------- fonction ------------------------------- */
  function syntaxHTML(f) {
    var m = f.syntax.match(/^([^(]+)\((.*)\)$/);
    if (!m) return esc(f.syntax);
    var args = m[2] ? m[2].split(';') : [];
    return '<span class="tk-fn">' + esc(m[1]) + '</span>(' + args.map(function (a, k) {
      a = a.trim();
      return '<span class="arg arg-' + (k % 6) + (/^\[.*\]$/.test(a) ? ' opt' : '') + '">' + esc(a) + '</span>';
    }).join('<span class="tk-sep">; </span>') + ')';
  }
  function argsTable(f) {
    if (!f.args.length) return '';
    var m = f.syntax.match(/\((.*)\)$/), nSyntax = m && m[1] ? m[1].split(';').length : 0;
    var colored = nSyntax === f.args.length; // couleurs seulement si chaque ligne correspond à un argument
    return '<table class="args"><tbody>' + f.args.map(function (a, k) {
      var opt = /^\[/.test(a[0]) || /facultatif/i.test(a[1]);
      return '<tr><th class="mono">' + (colored ? '<span class="dot arg-' + (k % 6) + '"></span>' : '') + esc(a[0].replace(/^\[|\]$/g, '')) +
        (opt ? ' <em>facultatif</em>' : '') + '</th><td>' + esc(a[1]) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }

  function fnSheet(ctx, f) {
    var m = ctx.m, ok = m.available(f, ctx.s.ver);
    var essential = f.sample ? ui.sampleSheet(f.sample, { fnName: f.fr }) :
      (f.ex[0] ? examples(ctx, [f.ex[0]], f.fr) : '');
    var otherEx = f.sample ? f.ex : f.ex.slice(1);
    var related = (m.usedIn[f.fr] || []);
    var moreBody =
      (otherEx.length ? '<h4>Autres exemples</h4>' + examples(ctx, otherEx) : '') +
      (f.tips.length > 1 ? '<h4>Bon à savoir</h4>' + ui.tips(f.tips.slice(1)) : '') +
      (f.see.length ? '<h4>Fonctions proches</h4>' + ui.fnChips(m, f.see, ctx.s.ver) : '') +
      (related.length ? '<h4>Méthodes qui l’utilisent</h4><ul class="links">' + related.map(function (r) {
        return '<li><a href="' + m.hrefOf(r) + '">' + esc(r.title) + '</a></li>';
      }).join('') + '</ul>' : '');
    var parts = [];
    if (otherEx.length) parts.push(count(otherEx.length, 'exemple', 'exemples'));
    if (f.tips.length > 1) parts.push(count(f.tips.length - 1, 'astuce', 'astuces'));
    if (f.see.length) parts.push('fonctions proches');

    return topBar(ctx, f) +
      '<h2 class="d-title mono">' + esc(f.fr) + ui.copyButton(f.fr) + '</h2>' +
      '<div class="d-sub">' + ui.levelBadge(m, f) + '<span>Anglais : <span class="mono">' + esc(f.en) + '</span></span>' +
      '<span class="' + (ok ? 'ok' : 'ko') + '">' + esc(m.versionLabel(f.since)) + (ok ? '' : ' — absente de ta version (' + esc(ctx.s.ver) + ')') + '</span></div>' +
      '<p class="d-desc">' + esc(f.desc) + '</p>' +
      section('L’essentiel', essential + (f.tips[0] ? ui.tips([f.tips[0]], true) : ''), 'essential') +
      section('Comprendre la syntaxe', '<div class="syntax mono">' + syntaxHTML(f) + '</div>' + argsTable(f)) +
      more('Aller plus loin' + (parts.length ? ' <small>' + parts.join(' · ') + '</small>' : ''), moreBody);
  }

  /* -------------------------------- méthode -------------------------------- */
  function rxSheet(ctx, r) {
    var m = ctx.m;
    var method = r.steps.filter(function (s) { return s.length < 3; });
    var checked = r.steps.filter(function (s) { return s.length >= 3; });
    if (!method.length) { method = checked; checked = []; }
    return topBar(ctx, r) +
      '<h2 class="d-title">' + esc(r.title) + '</h2>' +
      '<div class="d-sub">' + ui.levelBadge(m, r) + '</div>' +
      '<p class="d-desc">' + esc(r.desc) + '</p>' +
      (r.sample ? section('L’exemple', ui.sampleSheet(r.sample), 'essential') : '') +
      section('La méthode', examples(ctx, method), r.sample ? '' : 'essential') +
      (r.tips.length ? section('Bon à savoir', ui.tips(r.tips)) : '') +
      more('Exemples chiffrés <small>' + count(checked.length, 'résultat vérifié', 'résultats vérifiés') + '</small>', examples(ctx, checked)) +
      (r.fns.length ? section('Fonctions utilisées', ui.fnChips(m, r.fns, ctx.s.ver)) : '');
  }

  /* -------------------------------- notion -------------------------------- */
  function ntSheet(ctx, n) {
    var m = ctx.m, nb = m.neighbors(n), lvl = m.levelById[n.level];
    var nextLevel = m.levels[m.levels.indexOf(lvl) + 1];
    var nav = '<nav class="steps-nav">' +
      (nb.prev ? '<a class="prev" href="' + m.hrefOf(nb.prev) + '">' + ic('arrow-left') + '<span><small>Notion précédente</small>' + esc(nb.prev.title) + '</span></a>' : '<span></span>') +
      (nb.next ? '<a class="next" href="' + m.hrefOf(nb.next) + '"><span><small>Notion suivante</small>' + esc(nb.next.title) + '</span>' + ic('chevron-right') + '</a>' :
        (nextLevel ? '<a class="next" href="#/a/' + n.activity + '/' + nextLevel.id + '"><span><small>Niveau suivant</small>' + esc(nextLevel.label) + '</span>' + ic('chevron-right') + '</a>' : '<span></span>')) +
      '</nav>';
    return topBar(ctx, n) +
      '<h2 class="d-title">' + esc(n.title) + '</h2>' +
      '<div class="d-sub">' + ui.levelBadge(m, n) + '<span>Notion ' + n.step + ' sur ' + nb.total + '</span></div>' +
      '<p class="d-desc">' + esc(n.intro) + '</p>' +
      (n.sample ? section('Exemple', ui.sampleSheet(n.sample), 'essential') : '') +
      section('À retenir', '<ul class="points">' + n.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>', n.sample ? '' : 'essential') +
      (n.examples.length ? section(n.sample ? 'D’autres formules' : 'Exemples', examples(ctx, n.examples)) : '') +
      (n.tips.length ? section('Bon à savoir', ui.tips(n.tips)) : '') +
      (n.fns.length ? section('Fonctions de cette notion', ui.fnChips(m, n.fns, ctx.s.ver)) : '') +
      nav;
  }

  /* -------------------------------- erreur -------------------------------- */
  function errSheet(ctx, e) {
    return topBar(ctx, e) +
      '<h2 class="d-title mono">' + esc(e.fr) + '</h2><div class="d-sub"><span>Excel en anglais : <span class="mono">' + esc(e.en) + '</span></span></div>' +
      section('Cause', '<p class="d-desc">' + esc(e.cause) + '</p>', 'essential') +
      section('Solutions', '<ol class="fixes">' + e.fixes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>');
  }

  views.sheet = function (ctx, ref) {
    if (ref.type === 'fn') return fnSheet(ctx, ref.item);
    if (ref.type === 'rx') return rxSheet(ctx, ref.item);
    if (ref.type === 'nt') return ntSheet(ctx, ref.item);
    return errSheet(ctx, ref.item);
  };

  /** Panneau vide ; « first » (facultatif) = premier élément de la liste, proposé comme point de départ. */
  views.emptySheet = function (ctx, first) {
    var start = first ? '<a class="btn" href="' + ctx.m.hrefOf(first) + '">Commencer : ' +
      esc(first.title || first.fr) + ic('chevron-right') + '</a>' : '';
    return '<div class="d-empty">' + ic('math-function') + '<p>Choisis une notion, une fonction ou une méthode pour l’afficher ici.</p>' + start + '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
