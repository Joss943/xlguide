/*
 * Accueil : une seule action mise en avant (commencer ou reprendre), puis les 4 activités avec leur avancement.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var ui = XL.ui, esc = ui.esc, ic = ui.ic;
  var views = (XL.views = XL.views || {});

  var QUICK = ['figer la première ligne', 'liste déroulante', 'bloquer une cellule avec $', 'additionner avec une condition',
    'supprimer les doublons', 'tableau croisé dynamique', 'créer un graphique', 'imprimer sur une page'];

  /** Carte « Commencer / Reprendre » : la prochaine notion à lire, en un clic. */
  function resumeCard(ctx) {
    var m = ctx.m, P = XL.progress, total = P.stats(m, ctx.s.done);
    var next = P.resume(m, ctx.s.done, ctx.s.last);
    if (!next) {
      return '<section class="resume complete"><div class="resume-txt"><small>' + ic('check') + 'Parcours terminé</small>' +
        '<h2>Bravo, les ' + total.total + ' notions sont faites.</h2>' +
        '<p>Revois une notion quand tu en as besoin, ou cherche une fonction dans la barre de recherche.</p>' + ui.progress(total, 'Notions terminées') +
        '<button class="link-btn" data-reset>Remettre ma progression à zéro</button></div></section>';
    }
    var started = total.done > 0 || !!ctx.s.last;
    return '<section class="resume"><div class="resume-txt">' +
      '<small>' + (started ? 'Reprendre où tu en étais' : 'Par où commencer ?') + '</small>' +
      '<h2>' + esc(next.title) + '</h2>' +
      '<p class="resume-meta"><span>' + esc(m.placeLabel(next)) + '</span>' + ui.minutes(XL.progress.minutes(next)) + '</p>' +
      (started ? ui.progress(total, 'Notions terminées dans tout le parcours') : '') +
      '</div><a class="btn btn-accent btn-big" href="' + m.hrefOf(next) + '">' + ic('player-play') + (started ? 'Continuer' : 'Commencer') + '</a>' +
      (started ? '<button class="link-btn reset" data-reset>Remettre ma progression à zéro</button>' : '') + '</section>';
  }

  function activityCard(ctx, a, i) {
    var m = ctx.m, P = XL.progress;
    return '<article class="act">' +
      '<a class="act-h" href="#/a/' + a.id + '"><span class="act-n">' + (i + 1) + '</span>' + ic(a.icon) + '<b>' + esc(a.label) + '</b></a>' +
      '<p>' + esc(a.desc) + '</p>' +
      '<div class="act-levels">' + m.levels.map(function (l) {
        var st = P.stats(m, ctx.s.done, a.id, l.id), complete = st.done === st.total;
        return '<a class="act-level' + (complete ? ' complete' : '') + '" href="#/a/' + a.id + '/' + l.id + '">' +
          '<span class="lvl lvl-' + l.id + '">' + (complete ? ic('check') : '') + esc(l.label) + '</span>' +
          '<span class="prog-n">' + st.done + ' / ' + st.total + '</span></a>';
      }).join('') + '</div></article>';
  }

  views.home = function (ctx) {
    var m = ctx.m;
    return '<div class="page home">' +
      '<h1>Que veux-tu faire dans Excel ?</h1>' +
      '<p class="lead">Quatre activités, chacune en deux niveaux. Une notion à la fois, à ton rythme : ta progression est enregistrée sur cet appareil.</p>' +
      resumeCard(ctx) +
      '<div class="acts">' + m.activities.map(function (a, i) { return activityCard(ctx, a, i); }).join('') + '</div>' +
      '<div class="quick"><span class="muted">Recherches fréquentes :</span>' + QUICK.map(function (q) {
        return '<button class="chip" data-q="' + esc(q) + '">' + esc(q) + '</button>';
      }).join('') + '</div>' +
      '<p class="tools-line">' + ic('bolt') + 'Aussi dans <a href="#/outils">Outils</a> : traducteur de formules FR ⇄ EN, erreurs Excel, raccourcis clavier et index des ' +
      XL.functions.length + ' fonctions.</p>' +
      '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
