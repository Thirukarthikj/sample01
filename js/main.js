/**
 * Bobby Packaging - Application Entrypoint
 * Bootstraps the React 18 Application Core
 */

(function () {
  'use strict';

  // Check if React app is already running
  if (window.__BOBBY_PACKAGING_REACT_INITIALIZED__) return;

  function loadScript(src, callback) {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (callback) callback();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => { if (callback) callback(); };
    document.body.appendChild(script);
  }

  // Ensure React, ReactDOM, and React app are loaded
  if (typeof React === 'undefined') {
    loadScript('js/vendor/react.production.min.js', () => {
      loadScript('js/vendor/react-dom.production.min.js', () => {
        loadScript('js/react/app.js');
      });
    });
  } else if (typeof ReactDOM === 'undefined') {
    loadScript('js/vendor/react-dom.production.min.js', () => {
      loadScript('js/react/app.js');
    });
  } else {
    loadScript('js/react/app.js');
  }
})();
