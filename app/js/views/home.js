/*
 * Accueil : une seule action mise en avant (commencer ou reprendre), puis la carte du parcours :
 * un tableau activités × niveaux où chaque case montre l'avancement par une barre de données.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var ui = XL.ui, esc = ui.esc;
  var views = (XL.views = XL.views || {});

  var QUICK = ['figer la première ligne', 'liste déroulante', 'bloquer une cellule avec $', 'additionner avec une condition',
    'supprimer les doublons', 'tableau croisé dynamique', 'créer un graphique', 'imprimer sur une page'];

  /** Bloc « Commencer / Reprendre » : la prochaine notion à lire, en un clic. */
  function resumeBlock(ctx, next, total, started) {
    var m = ctx.m;
    if (!next) {
      return '<section class="resume complete"><div><p class="resume-k">Parcours terminé</p>' +
        '<h2>Bravo, les ' + total.total + ' notions sont faites.</h2>' +
        '<p class="resume-meta">Revois une notion quand tu en as besoin, ou cherche une fonction dans la barre de recherche.</p></div></section>';
    }
    return '<section class="resume"><div><p class="resume-k">' + (started ? 'Reprendre où tu en étais' : 'Par où commencer ?') + '</p>' +
      '<h2>' + esc(next.title) + '</h2>' +
      '<p class="resume-meta"><span>' + esc(m.placeLabel(next)) + '</span>' + ui.minutes(XL.progress.minutes(next)) + '</p></div>' +
      '<a class="btn btn-accent btn-big" href="' + m.hrefOf(next) + '">' + (started ? 'Continuer' : 'Commencer') + '</a></section>';
  }

  /** Avancement global et remise à zéro, sous le bloc principal. */
  function overall(total, started) {
    if (!started) return '';
    return '<div class="overall">' + ui.progress(total, 'Notions terminées dans tout le parcours', ui.doneText(total)) +
      '<button class="link-btn" data-reset>Remettre ma progression à zéro</button></div>';
  }

  /** Carte du parcours : chaque case dit où tu en es (« En cours », « Terminé ») et montre l'avancement en barre de données. */
  function map(ctx, next) {
    var m = ctx.m, P = XL.progress;
    var head = '<thead><tr><th scope="col"><span class="sr">Activité</span></th>' + m.levels.map(function (l) {
      return '<th scope="col">' + esc(l.label) + '</th>';
    }).join('') + '</tr></thead>';
    var body = m.activities.map(function (a) {
      return '<tr><th scope="row"><a href="#/a/' + a.id + '">' + esc(a.label) + '</a><small>' + esc(a.desc) + '</small></th>' +
        m.levels.map(function (l) {
          var st = P.stats(m, ctx.s.done, a.id, l.id), complete = st.total > 0 && st.done === st.total;
          var cur = next && next.activity === a.id && next.level === l.id;
          var status = cur ? 'En cours' : complete ? 'Terminé' : '';
          return '<td><a class="cell' + (complete ? ' complete' : '') + (cur ? ' cur' : '') + '" href="#/a/' + a.id + '/' + l.id + '" ' +
            'aria-label="' + esc(a.label + ', ' + l.label + ' : ' + ui.doneText(st) + (status ? ', ' + status.toLowerCase() : '')) + '">' +
            '<span class="cell-k" aria-hidden="true">' + status + '</span><span class="cell-b" aria-hidden="true">' +
            '<progress class="bar" value="' + st.done + '" max="' + st.total + '"></progress>' +
            '<span class="cell-n">' + st.done + ' / ' + st.total + '</span></span></a></td>';
        }).join('') + '</tr>';
    }).join('');
    return '<table class="map"><caption>Ton parcours</caption>' + head + '<tbody>' + body + '</tbody></table>';
  }

  views.home = function (ctx) {
    var m = ctx.m, P = XL.progress, total = P.stats(m, ctx.s.done);
    var next = P.resume(m, ctx.s.done, ctx.s.last), started = total.done > 0 || !!ctx.s.last;
    return '<div class="page home">' +
      '<h1>Que veux-tu faire dans Excel ?</h1>' +
      '<p class="lead">Quatre activités, chacune en trois niveaux : les bases, l’intermédiaire, l’expert. ' +
      'Une notion à la fois, à ton rythme. Ta progression reste sur cet appareil.</p>' +
      resumeBlock(ctx, next, total, started) + overall(total, started) + map(ctx, next) +
      '<div class="quick"><span>Recherches fréquentes</span>' + QUICK.map(function (q) {
        return '<button data-q="' + esc(q) + '">' + esc(q) + '</button>';
      }).join('') + '</div>' +
      '<p class="tools-line">Aussi dans les <a href="#/outils">outils</a> : le traducteur de formules français ⇄ anglais, les erreurs Excel, ' +
      'les raccourcis clavier et l’index des ' + XL.functions.length + ' fonctions.</p>' +
      '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
