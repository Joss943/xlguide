/* Progression : statistiques, ordre du parcours, reprise, durée estimée. */
'use strict';
const { check, section } = require('./lib');

module.exports = function (XL) {
  const m = XL.buildModel(), P = XL.progress;
  const all = P.notionsOf(m);

  section('Progression');
  check(all.length === XL.notions.length, 'chaque notion apparaît une fois dans l’ordre du parcours');
  check(all[0] === m.place(m.activities[0].id, m.levels[0].id).notions[0], 'le parcours commence par la 1re notion des bases de la 1re activité');
  const lastBase = m.place('saisir', 'base').notions.slice(-1)[0];
  check(P.after(m, lastBase) === m.place('saisir', 'intermediaire').notions[0], 'après la dernière notion d’un niveau : la 1re du niveau suivant');
  check(P.after(m, all[all.length - 1]) === null && P.before(m, all[0]) === null, 'pas de notion avant la première ni après la dernière');
  check(P.before(m, all[1]) === all[0], 'notion précédente');

  const st = P.stats(m, [all[0].key, all[1].key, 'n:inconnue']);
  check(st.done === 2 && st.total === all.length, 'stats globales (clé inconnue ignorée)');
  const lvl = P.stats(m, [all[0].key], 'saisir', 'base');
  check(lvl.done === 1 && lvl.total === m.place('saisir', 'base').notions.length, 'stats d’un niveau');
  check(P.stats(m, [], 'calculer').total === m.levels.reduce((t, l) => t + m.place('calculer', l.id).notions.length, 0), 'stats d’une activité');

  check(P.resume(m, [], '') === all[0], 'reprise : la 1re notion au départ');
  check(P.resume(m, [], all[5].key) === all[5], 'reprise : la dernière notion ouverte si elle n’est pas terminée');
  check(P.resume(m, [all[0].key], all[0].key) === all[1], 'reprise : la 1re notion non terminée si la dernière ouverte est faite');
  check(P.resume(m, all.map((n) => n.key), all[3].key) === null, 'reprise : rien quand tout est terminé');
  check(P.resume(m, [], 'f:SOMME') === all[0], 'reprise : une fiche fonction ne compte pas comme notion');
  check(P.firstTodo(m, [all[0].key], 'saisir', 'base') === all[1], 'premier « à faire » d’un niveau');

  XL.notions.forEach((n) => {
    const min = P.minutes(n);
    check(Number.isInteger(min) && min >= 1 && min <= 10, n.title + ' : durée estimée hors bornes (' + min + ')');
  });
};
