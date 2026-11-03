/*
 * Accueil : les 4 activités, par où commencer, quelques recherches typiques.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var ui = XL.ui, esc = ui.esc, ic = ui.ic;
  var views = (XL.views = XL.views || {});

  var QUICK = ['figer la première ligne', 'liste déroulante', 'bloquer une cellule avec $', 'additionner avec une condition',
    'supprimer les doublons', 'tableau croisé dynamique', 'créer un graphique', 'imprimer sur une page'];

  function activityCard(m, a, i) {
    var first = m.place(a.id, 'base').notions.slice(0, 3);
    return '<article class="act">' +
      '<a class="act-h" href="#/a/' + a.id + '"><span class="act-n">' + (i + 1) + '</span>' + ic(a.icon) + '<b>' + esc(a.label) + '</b></a>' +
      '<p>' + esc(a.desc) + '</p>' +
      '<div class="act-start"><small>Commence par</small><ol>' + first.map(function (n) {
        return '<li><a href="' + m.hrefOf(n) + '">' + esc(n.title) + '</a></li>';
      }).join('') + '</ol></div>' +
      '<div class="act-levels">' + m.levels.map(function (l) {
        return '<a class="lvl lvl-' + l.id + '" href="#/a/' + a.id + '/' + l.id + '">' + esc(l.label) + '</a>';
      }).join('') + '</div></article>';
  }

  views.home = function (ctx) {
    var m = ctx.m;
    return '<div class="page home">' +
      '<h1>Que veux-tu faire dans Excel ?</h1>' +
      '<p class="lead">Quatre activités, chacune en deux niveaux : les bases, puis l’intermédiaire. Commence où tu veux, ou décris ton besoin dans la barre de recherche.</p>' +
      '<div class="acts">' + m.activities.map(function (a, i) { return activityCard(m, a, i); }).join('') + '</div>' +
      '<div class="quick"><span class="muted">Recherches fréquentes :</span>' + QUICK.map(function (q) {
        return '<button class="chip" data-q="' + esc(q) + '">' + esc(q) + '</button>';
      }).join('') + '</div>' +
      '<p class="tools-line">' + ic('bolt') + 'Aussi dans <a href="#/outils">Outils</a> : traducteur de formules FR ⇄ EN, erreurs Excel, raccourcis clavier et index des ' +
      XL.functions.length + ' fonctions.</p>' +
      '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
