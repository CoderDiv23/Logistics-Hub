/**
 * Browser Compatibility Utility
 * Provides feature detection and polyfills for cross-browser support
 */

/**
 * Detects if the browser supports a specific feature
 * @param {string} feature - Feature to detect
 * @returns {boolean} Whether the feature is supported
 */
export const supportsFeature = (feature) => {
  switch (feature) {
    case 'fetch':
      return typeof window !== 'undefined' && window.fetch !== undefined;
    
    case 'promise':
      return typeof Promise !== 'undefined';
    
    case 'arrowFunctions':
      try {
        // eslint-disable-next-line no-new-func
        new Function('() => {}');
        return true;
      } catch (e) {
        return false;
      }
    
    case 'destructuring':
      try {
        // eslint-disable-next-line no-eval
        eval('var {a} = {a:1};');
        return true;
      } catch (e) {
        return false;
      }
    
    case 'asyncAwait':
      try {
        // eslint-disable-next-line no-new-func
        new Function('async () => {}');
        return true;
      } catch (e) {
        return false;
      }
    
    case 'localStorage':
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    
    case 'geolocation':
      return typeof navigator !== 'undefined' && navigator.geolocation !== undefined;
    
    case 'websockets':
      return typeof WebSocket !== 'undefined';
    
    case 'serviceWorker':
      return typeof navigator !== 'undefined' && navigator.serviceWorker !== undefined;
    
    default:
      return false;
  }
};

/**
 * Gets browser information
 * @returns {Object} Browser information
 */
export const getBrowserInfo = () => {
  if (typeof navigator === 'undefined') {
    return {
      name: 'Unknown',
      version: 'Unknown',
      supports: []
    };
  }
  
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  
  // Detect browser name and version
  if (ua.indexOf('Firefox') > -1) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)[1];
  } else if (ua.indexOf('Chrome') > -1) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)[1];
  } else if (ua.indexOf('Safari') > -1) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+)/)[1];
  } else if (ua.indexOf('Edge') > -1) {
    name = 'Edge';
    version = ua.match(/Edge\/(\d+)/)[1];
  }
  
  // Check supported features
  const supports = [];
  const features = [
    'fetch', 'promise', 'arrowFunctions', 'destructuring', 
    'asyncAwait', 'localStorage', 'geolocation', 'websockets'
  ];
  
  features.forEach(feature => {
    if (supportsFeature(feature)) {
      supports.push(feature);
    }
  });
  
  return {
    name,
    version,
    supports
  };
};

/**
 * Shows browser compatibility warning
 * @param {string} message - Warning message
 */
export const showCompatibilityWarning = (message) => {
  const warning = document.createElement('div');
  warning.className = 'browser-warning alert alert-warning fixed-top m-0 rounded-0';
  warning.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-exclamation-triangle me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  `;
  
  // Add styles for the warning
  const style = document.createElement('style');
  style.textContent = `
    .browser-warning {
      z-index: 1050;
    }
  `;
  document.head.appendChild(style);
  
  // Insert warning at the top of the body
  document.body.insertBefore(warning, document.body.firstChild);
};

/**
 * Checks browser compatibility and shows warnings if needed
 */
export const checkBrowserCompatibility = () => {
  const browser = getBrowserInfo();
  const minVersions = {
    Chrome: 80,
    Firefox: 75,
    Safari: 13,
    Edge: 80
  };
  
  // Check if browser version is supported
  if (minVersions[browser.name]) {
    const version = parseInt(browser.version, 10);
    if (version < minVersions[browser.name]) {
      showCompatibilityWarning(
        `Your browser (${browser.name} ${browser.version}) is outdated. ` +
        `Please update to version ${minVersions[browser.name]} or higher for the best experience.`
      );
    }
  }
  
  // Check for critical missing features
  const criticalFeatures = ['fetch', 'promise', 'localStorage'];
  const missingFeatures = criticalFeatures.filter(feature => !browser.supports.includes(feature));
  
  if (missingFeatures.length > 0) {
    showCompatibilityWarning(
      'Your browser is missing critical features required for this application. ' +
      'Please update your browser for the best experience.'
    );
  }
};

/**
 * Loads polyfills for missing features
 */
export const loadPolyfills = async () => {
  const polyfills = [];
  
  // Load fetch polyfill if needed
  if (!supportsFeature('fetch')) {
    polyfills.push(import('whatwg-fetch'));
  }
  
  // Load Promise polyfill if needed
  if (!supportsFeature('promise')) {
    polyfills.push(import('es6-promise'));
  }
  
  // Wait for all polyfills to load
  if (polyfills.length > 0) {
    await Promise.all(polyfills);
  }
};

// Run compatibility check on load
if (typeof window !== 'undefined') {
  // Check compatibility after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkBrowserCompatibility);
  } else {
    checkBrowserCompatibility();
  }
}

export default {
  supportsFeature,
  getBrowserInfo,
  showCompatibilityWarning,
  checkBrowserCompatibility,
  loadPolyfills
};