/* ROOPIX page bootstrap: keep page identity and reveal fallback same-origin. */
(function () {
  'use strict';
  var path = window.location.pathname;
  var pageClass = /\/beauty(?:\/|$)/.test(path) ? 'pg-beauty' :
    (/\/exports(?:\/|$)/.test(path) ? 'pg-exports' : 'pg-home');
  document.documentElement.classList.add('js', pageClass);
  window.setTimeout(function () {
    if (!window.__roopixBase) document.documentElement.classList.remove('js');
  }, 4000);
})();
