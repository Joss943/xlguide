/*
 * Outils : sommaire, navigation entre outils, traducteur FR ⇄ EN (gabarit), raccourcis clavier.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var ui = XL.ui, esc = ui.esc, ic = ui.ic;
  var views = (XL.views = XL.views || {});

  function tools(m) {
    return [
      { route: 'tr', icon: 'arrows-left-right', label: 'Traducteur FR ⇄ EN', desc: 'Convertir une formule trouvée dans un tutoriel anglais.' },
      { route: 'err', icon: 'alert-circle', label: 'Erreurs Excel', desc: XL.errors.length + ' erreurs expliquées : #N/A, #VALEUR!, #PROPAGATION!…' },
      { route: 'kb', icon: 'keyboard', label: 'Raccourcis clavier', desc: 'Les raccourcis utiles, clavier français.' },
      { route: 'fn', icon: 'book', label: 'Index des fonctions A→Z', desc: XL.functions.length + ' fonctions, y compris les plus spécialisées.' },
      { route: 'rx', icon: 'receipt-tax', label: 'Cas pratiques : comptabilité', desc: m.recipesOfDomain('compta').length + ' formules métier (TVA, emprunts, amortissements…).' },
      { route: 'it', icon: 'network', label: 'Cas pratiques : informatique', desc: m.recipesOfDomain('it').length + ' formules d’administration (IP, Active Directory, parc…).' }
    ];
  }

  /** Navigation verticale entre outils (colonne latérale). */
  views.toolsNav = function (ctx, active) {
    return '<div class="side-h">' + ic('bolt') + 'Outils</div>' + tools(ctx.m).map(function (t) {
      return '<a class="cat' + (t.route === active ? ' on' : '') + '" href="#/' + t.route + '">' + ic(t.icon) + '<span>' + esc(t.label) + '</span></a>';
    }).join('');
  };

  views.toolsHub = function (ctx) {
    return '<div class="page"><h1>' + ic('bolt') + 'Outils</h1>' +
      '<p class="lead">Ce qui ne fait pas partie du parcours d’apprentissage mais sert au quotidien.</p>' +
      '<div class="tool-grid">' + tools(ctx.m).map(function (t) {
        return '<a class="tool" href="#/' + t.route + '">' + ic(t.icon) + '<b>' + esc(t.label) + '</b><span>' + esc(t.desc) + '</span></a>';
      }).join('') + '</div></div>';
  };

  var TR_SAMPLES = [
    '=IFERROR(VLOOKUP(A2,Sheet2!$A:$C,3,FALSE),"Not found")',
    '=SUMIFS(D:D,A:A,"607*",B:B,">="&DATE(2026,1,1))',
    '=SOMMEPROD((GAUCHE(A2:A500;1)="6")*D2:D500)',
    '=XLOOKUP(A2,Accounts[Code],Accounts[Label],"Unknown")'
  ];

  views.translator = function () {
    return '<div class="page tr">' +
      '<h1>' + ic('arrows-left-right') + 'Traducteur de formules FR ⇄ EN</h1>' +
      '<p class="lead">Colle une formule trouvée dans un tutoriel anglais : elle est convertie pour Excel en français (noms de fonctions, « , » → « ; », décimales, VRAI/FAUX). Ça marche aussi dans l’autre sens.</p>' +
      '<div class="tr-grid">' +
      '<div class="tr-pane"><div class="tr-h"><b>' + ic('language') + 'Excel en français</b><button class="btn-s" id="trCopyFr">' + ic('copy') + 'Copier</button></div>' +
      '<textarea id="trFr" class="mono" spellcheck="false" placeholder="=SOMME.SI(A2:A100;&quot;Payé&quot;;C2:C100)"></textarea></div>' +
      '<div class="tr-mid"><span id="trDir">' + ic('arrows-left-right') + '</span></div>' +
      '<div class="tr-pane"><div class="tr-h"><b>' + ic('world') + 'Excel en anglais</b><button class="btn-s" id="trCopyEn">' + ic('copy') + 'Copier</button></div>' +
      '<textarea id="trEn" class="mono" spellcheck="false" placeholder="=SUMIF(A2:A100,&quot;Paid&quot;,C2:C100)"></textarea></div>' +
      '</div><div id="trWarn" class="tr-warn"></div><div id="trFns" class="chips"></div>' +
      '<div class="tr-samples"><span class="muted">Essayer :</span>' + TR_SAMPLES.map(function (s) {
        return '<button class="chip mono" data-sample="' + esc(s) + '">' + esc(s.length > 48 ? s.slice(0, 46) + '…' : s) + '</button>';
      }).join('') + '</div></div>';
  };

  views.shortcuts = function (ctx) {
    var q = XL.search.norm(ctx.s.q || ''), groups = {};
    XL.shortcuts.forEach(function (k) {
      if (q && XL.search.norm(k.keys + ' ' + k.action + ' ' + k.cat).indexOf(q) < 0) return;
      (groups[k.cat] = groups[k.cat] || []).push(k);
    });
    var names = Object.keys(groups);
    return '<div class="page kb"><h1>' + ic('keyboard') + 'Raccourcis clavier</h1>' +
      '<p class="lead">Excel pour Windows, clavier français (AZERTY). Filtre avec la barre de recherche.</p>' +
      (names.length ? names.map(function (gname) {
        return '<h2>' + esc(gname) + '</h2><table class="kb-t"><tbody>' + groups[gname].map(function (k) {
          return '<tr><td class="keys">' + k.keys.split(' / ').map(function (combo) {
            return combo.split(' + ').map(function (x) { return '<kbd>' + esc(x) + '</kbd>'; }).join('<i>+</i>');
          }).join(' <span class="muted">ou</span> ') + '</td><td>' + esc(k.action) + '</td></tr>';
        }).join('') + '</tbody></table>';
      }).join('') : '<p class="empty">Aucun raccourci ne correspond.</p>') + '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
