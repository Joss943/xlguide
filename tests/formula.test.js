/* Moteur de formules : traduction FR ⇄ EN, détection, références de cellules, recopie, découpage des arguments. */
'use strict';
const { check, section } = require('./lib');

module.exports = function (XL) {
  const F = XL.formula;
  const T = (f, d) => F.translate(f, d).result;

  section('Traducteur');
  check(T('=SIERREUR(RECHERCHEV(A2;$F$2:$H$9;3;FAUX);"x;y")', 'fr2en') === '=IFERROR(VLOOKUP(A2,$F$2:$H$9,3,FALSE),"x;y")', 'traduction SIERREUR/RECHERCHEV');
  check(T('=IF(AND(A1>0.5,B1<>"a,b"),SUM(A1:A3),0)', 'en2fr') === '=SI(ET(A1>0,5;B1<>"a,b");SOMME(A1:A3);0)', 'traduction IF/AND + décimale');
  check(T('=XLOOKUP(A2,T[Code],T[Label],"?")', 'en2fr') === '=RECHERCHEX(A2;T[Code];T[Label];"?")', 'références structurées conservées');
  check(T("='My Sheet'!A1+SUM('Sheet, 2'!B1:B3)", 'en2fr') === "='My Sheet'!A1+SOMME('Sheet, 2'!B1:B3)", 'noms de feuilles conservés');
  check(F.detect('=SOMME(A1;2,5)') === 'fr' && F.detect('=SUM(A1,2.5)') === 'en', 'détection de la langue');
  check(F.translate('=FOO(1;2)', 'fr2en').unknown[0] === 'FOO', 'fonction inconnue signalée');

  section('Références de cellules');
  const refs = (f) => F.refs(f).map((r) => r.text).join(' ');
  check(refs('=SOMME(A2:A6)*$B$1') === 'A2:A6 $B$1', 'plage et référence absolue');
  check(refs('=Feuil1!D3+LOG10(100)+1E12+T[A1]') === '', 'ignorées : autre feuille, nom de fonction, notation scientifique, tableau structuré');
  check(refs('="A2"&B2') === 'B2', 'pas de référence dans une chaîne');
  const r = F.refs('=SOMME(B2:C7)')[0];
  check(r.c1 === 2 && r.r1 === 2 && r.c2 === 3 && r.r2 === 7, 'coordonnées d’une plage');
  check(F.colLetters(1) === 'A' && F.colLetters(28) === 'AB' && F.colNum('AB') === 28, 'lettres de colonnes');

  section('Recopie vers le bas (références relatives / absolues)');
  check(F.shiftRows('=SI(ESTNA(EQUIV(A2;$B$2:$B$6;0));"A2";B$1+C2)', 3) === '=SI(ESTNA(EQUIV(A5;$B$2:$B$6;0));"A2";B$1+C5)', '$ et chaînes respectés');
  check(F.shiftRows('=B2*$E$1', 0) === '=B2*$E$1', 'décalage nul');
  check(F.shiftRows('=SOMME($A2:A2)', 2) === '=SOMME($A4:A4)', 'colonne figée, ligne relative');

  section('Découpage des arguments');
  const call = F.splitCall('=SOMME.SI(A2:A6;"Nord";SI(B2>0;C2:C6;0))');
  check(call && call.name === 'SOMME.SI' && call.args.length === 3, 'trois arguments de premier niveau');
  check(call && call.args[2].text === 'SI(B2>0;C2:C6;0)', 'argument imbriqué conservé entier');
  check(F.splitCall('=SOMME(A1:A3)*2') === null, 'pas un appel unique → null');
  const html = F.highlightSpans('=SOMME(A1:A3)', 'fr', [{ start: 7, end: 12, cls: 'arg arg-0' }]);
  const strip = (h) => h.replace(/<[^>]*>/g, '');
  check(strip(html) === '=SOMME(A1:A3)' && strip(html.split('<span class="arg arg-0">')[1] || '').startsWith('A1:A3)'), 'coloration d’un argument');
  check(!/href="#\/f\/PLANCHER"/.test(F.highlight('=PLANCHER(A1;7)', 'fr')), 'pas de lien vers une fonction sans fiche');
};
