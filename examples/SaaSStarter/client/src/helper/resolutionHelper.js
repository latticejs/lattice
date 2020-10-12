/**
 * Will check the browser is safari.
 * @return {Boolean} [True if running on Safari.]
 */
function isIE11() {
  if (!window.ActiveXObject && 'ActiveXObject' in window) {
    return true;
  }
  return false;
}
/**
 * Will check whether the application is running on mobile or on desktop.
 * @return {Boolean} [True if running on mobile.]
 */
function isMobile(width) {
  if (width <= 768) {
    return true;
  }
  return false;
}

export { isIE11, isMobile };
