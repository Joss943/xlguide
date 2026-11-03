/* XLGuide — site : détection du système, onglets Linux, copie des commandes, dernière version */
(function () {
  'use strict';
  // Icônes Tabler : déjà intégrées par scripts/build-site.js ; ce code ne sert qu'en aperçu local.
  if (window.XL && window.XL.icon) {
    document.querySelectorAll('i[data-ic]').forEach(function (el) { el.outerHTML = window.XL.icon(el.getAttribute('data-ic')); });
  }
  var ua = navigator.userAgent || '';
  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  var isWin = /Win/i.test(platform) || /Windows/i.test(ua);
  var isLinux = !isWin && /Linux|X11/i.test(platform + ' ' + ua) && !/Android/i.test(ua);

  function showDistro(d) {
    document.querySelectorAll('.distros button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-d') === d); });
    document.querySelectorAll('.dpanel').forEach(function (p) { p.hidden = p.getAttribute('data-p') !== d; });
  }
  document.querySelectorAll('.distros button').forEach(function (b) {
    b.addEventListener('click', function () { showDistro(b.getAttribute('data-d')); });
  });

  if (isWin) { document.getElementById('btnWin').classList.add('recommended'); }
  if (isLinux) {
    document.getElementById('btnLinux').classList.add('recommended');
    if (/Fedora|Red Hat|SUSE|CentOS|Rocky|Alma/i.test(ua)) showDistro('rpm');
    else if (/Arch|Manjaro|Endeavour/i.test(ua)) showDistro('arch');
  }
  document.getElementById('btnLinux').addEventListener('click', function () {
    var card = document.getElementById('linux');
    card.classList.add('target'); setTimeout(function () { card.classList.remove('target'); }, 2200);
  });

  var toast = document.getElementById('toast'), t;
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var code = b.parentNode.querySelector('code').textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(function () {
        toast.classList.add('show'); clearTimeout(t); t = setTimeout(function () { toast.classList.remove('show'); }, 1400);
      }, function () { window.prompt('Copie la commande :', code); });
    });
  });

  // Affiche la dernière version publiée (sans bloquer si l'API GitHub est indisponible)
  if (window.fetch) {
    fetch('https://api.github.com/repos/Joss943/xlguide/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rel) {
        if (!rel || !rel.tag_name) return;
        var d = new Date(rel.published_at);
        document.getElementById('relInfo').innerHTML = 'Dernière version : <a href="' + rel.html_url + '">' + rel.tag_name.replace(/[<>&"]/g, '') +
          '</a>, publiée le ' + d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + '.';
      })
      .catch(function () {});
  }
})();
