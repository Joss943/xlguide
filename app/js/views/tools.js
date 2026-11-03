/*
 * Outils : sommaire, navigation entre outils, traducteur FR ⇄ EN (gabarit), raccourcis clavier.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  var ui = XL.ui, esc = ui.esc, ic = ui.ic;
  var views = (XL.views = XL.views || {});

  function tools() {
    return [
      { route: 'tr', label: 'Traducteur de formules', desc: 'Convertir une formule trouvée dans un tutoriel anglais, ou l’inverse.' },
      { route: 'err', label: 'Erreurs Excel', desc: XL.errors.length + ' erreurs expliquées : #N/A, #VALEUR!, #PROPAGATION!…' },
      { route: 'kb', label: 'Raccourcis clavier', desc: 'Les raccourcis utiles, clavier français.' },
      { route: 'fn', label: 'Index des fonctions', desc: 'Les ' + XL.functions.length + ' fonctions du parcours, de A à Z, rangées par thème.' }
    ];
  }

  /** Navigation verticale entre outils (colonne latérale). */
  views.toolsNav = function (ctx, active) {
    return '<h3 class="side-h">Outils</h3>' + tools().map(function (t) {
      return '<a class="cat' + (t.route === active ? ' on' : '') + '" href="#/' + t.route + '"' + (t.route === active ? ' aria-current="page"' : '') +
        '><span>' + esc(t.label) + '</span></a>';
    }).join('');
  };

  views.toolsHub = function (ctx) {
    return '<div class="page"><h1>Outils</h1>' +
      '<p class="lead">À garder sous la main pendant que tu travailles dans Excel.</p>' +
      '<div class="rows tool-list">' + tools().map(function (t) {
        return '<a class="tool-row" href="#/' + t.route + '"><span class="nm">' + esc(t.label) + '</span><span class="ds">' + esc(t.desc) + '</span></a>';
      }).join('') + '</div></div>';
  };

  var TR_SAMPLES = [
    '=IFERROR(VLOOKUP(A2,Sheet2!$A:$C,3,FALSE),"Not found")',
    '=SUMIFS(D:D,A:A,"North",B:B,">="&DATE(2026,1,1))',
    '=SI(ET(B2>=10;C2="Oui");"OK";"À vérifier")',
    '=XLOOKUP(A2,Products[Code],Products[Price],"Unknown")'
  ];

  views.translator = function () {
    return '<div class="page tr">' +
      '<h1>Traducteur de formules</h1>' +
      '<p class="lead">Colle une formule trouvée dans un tutoriel anglais : elle est convertie pour Excel en français (noms de fonctions, « , » → « ; », décimales, VRAI/FAUX). Ça marche aussi dans l’autre sens.</p>' +
      '<div class="tr-grid">' +
      '<div class="tr-pane"><div class="tr-h"><b>Excel en français</b><button class="btn-s" id="trCopyFr">Copier</button></div>' +
      '<textarea id="trFr" class="mono" spellcheck="false" placeholder="=SOMME.SI(A2:A100;&quot;Payé&quot;;C2:C100)"></textarea></div>' +
      '<div class="tr-mid"><span id="trDir">' + ic('arrows-left-right') + '</span></div>' +
      '<div class="tr-pane"><div class="tr-h"><b>Excel en anglais</b><button class="btn-s" id="trCopyEn">Copier</button></div>' +
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
    return '<div class="page kb"><h1>Raccourcis clavier</h1>' +
      '<p class="lead">Excel pour Windows, clavier français (AZERTY). Filtre avec la barre de recherche.</p>' +
      (names.length ? names.map(function (gname) {
        return '<h2>' + esc(gname) + '</h2><table class="kb-t"><tbody>' + groups[gname].map(function (k) {
          return '<tr><td class="keys-c">' + k.keys.split(' / ').map(function (combo) {
            return combo.split(' + ').map(function (x) { return '<kbd>' + esc(x) + '</kbd>'; }).join('<i>+</i>');
          }).join(' <span class="muted">ou</span> ') + '</td><td>' + esc(k.action) + '</td></tr>';
        }).join('') + '</tbody></table>';
      }).join('') : '<p class="empty">Aucun raccourci ne correspond.</p>') + '</div>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
