/*
 * Progression dans le parcours : notions terminées, notion suivante, reprise, durée de lecture.
 * Pur : reçoit le modèle et la liste des clés terminées ('n:…') ; le stockage reste dans app.js.
 */
(function (g) {
  'use strict';
  var XL = (g.XL = g.XL || {});
  // Durée estimée = lecture (150 mots/min) + pratique dans Excel (30 s par étape, 30 s par mini-tableau, 15 s par exemple).
  var WORDS_PER_MINUTE = 150, STEP_MIN = 0.5, SAMPLE_MIN = 0.5, EXAMPLE_MIN = 0.25;

  /** Notions dans l'ordre du parcours : tout, une activité, ou un niveau d'une activité. */
  function notionsOf(m, activity, level) {
    if (activity && level) return m.place(activity, level).notions;
    var acts = activity ? [m.actById[activity]] : m.activities, out = [];
    acts.forEach(function (a) {
      m.levels.forEach(function (l) { out = out.concat(m.place(a.id, l.id).notions); });
    });
    return out;
  }
  function isDone(done, n) { return done.indexOf(n.key) >= 0; }

  XL.progress = {
    notionsOf: notionsOf,

    /** { done, total } pour tout le parcours, une activité ou un niveau. */
    stats: function (m, done, activity, level) {
      var list = notionsOf(m, activity, level);
      return { done: list.filter(function (n) { return isDone(done, n); }).length, total: list.length };
    },

    /** Notion suivante dans l'ordre du parcours (passe au niveau, puis à l'activité suivante), ou null. */
    after: function (m, n) {
      var all = notionsOf(m);
      return all[all.indexOf(n) + 1] || null;
    },
    /** Notion précédente dans l'ordre du parcours, ou null. */
    before: function (m, n) {
      var all = notionsOf(m), i = all.indexOf(n);
      return i > 0 ? all[i - 1] : null;
    },

    /** Où reprendre : la dernière notion ouverte si elle n'est pas terminée, sinon la première non terminée (null si tout est fait). */
    resume: function (m, done, lastKey) {
      var last = lastKey ? m.resolve(lastKey) : null;
      if (last && last.type === 'nt' && !isDone(done, last.item)) return last.item;
      var all = notionsOf(m);
      for (var i = 0; i < all.length; i++) if (!isDone(done, all[i])) return all[i];
      return null;
    },

    /** Première notion non terminée d'un niveau (ou la première du niveau si tout est fait). */
    firstTodo: function (m, done, activity, level) {
      var list = notionsOf(m, activity, level);
      return list.filter(function (n) { return !isDone(done, n); })[0] || list[0] || null;
    },

    /** Durée estimée (lecture + pratique), en minutes entières, au moins 1. */
    minutes: function (n) {
      var text = [n.intro].concat(n.steps, n.points, n.tips, n.examples.map(function (e) { return e[1]; })).join(' ');
      var words = text.split(/\s+/).filter(Boolean).length;
      var min = words / WORDS_PER_MINUTE + n.steps.length * STEP_MIN + (n.sample ? SAMPLE_MIN : 0) + n.examples.length * EXAMPLE_MIN;
      return Math.max(1, Math.round(min));
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
