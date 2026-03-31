// Import app controller
import { initApp } from './js/app-controller.js';

/**
 * Initialize the application when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already loaded
  initApp();
}
