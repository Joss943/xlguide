/* XLGuide — tests : node tests/run.js (aucune dépendance, aucun navigateur ; Electron est simulé). */
'use strict';
const { counts } = require('./lib');
const XL = require('./load')();

const summary = [
  require('./data.test')(XL),
  require('./formula.test')(XL),
  require('./search.test')(XL),
  require('./progress.test')(XL),
  require('./views.test')(XL),
  require('./files.test')(XL),
  require('./security.test')(XL)
].filter(Boolean);

console.log('\n' + summary.join('\n'));
console.log(counts.failed ? '\n✗ ' + counts.failed + ' échec(s), ' + counts.passed + ' réussite(s)' : '\n✓ ' + counts.passed + ' vérifications réussies');
process.exit(counts.failed ? 1 : 0);
