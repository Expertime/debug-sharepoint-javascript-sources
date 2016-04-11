/** global constants */
const browser = chrome;
// key to store the 'enabled' flag value in localStorage
const enabledKey = 'SpJsDebug_enabled';
const requestFilters = {
  'urls': [
    '*://*.sharepointonline.com/*/_layouts/15/*/*.js',
    '*://*.sharepoint.com/_layouts/15/*/*.js'
  ],
  'types': ['script']
};
const keepPattern = /(\.debug|start)\.js$/;

/** startup actions  */
localStorage.setItem(enabledKey, false); // disabling at startup
browser.browserAction.onClicked.addListener(setEnabled);

/**
 * For changing the request listener status (that will give access to debug-version of js files).
 */
function setEnabled() {
  // switching the actual 'enabled' flag value
  const enabled = localStorage.getItem(enabledKey) != 'true';
  if (enabled) {
    // enabled -> add request listener
    browser.webRequest.onBeforeRequest.addListener(onBeforeRequestListener, requestFilters, ['blocking']);
  } else {
    // disabled -> remove request listener
    browser.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener);
  }
  // setting icon according to enabled status
  browser.browserAction.setIcon({
    'path': `/icons/icon19${enabled ? '' : '_disabled'}.png`
  });
  // saving the enabled flag value
  localStorage.setItem(enabledKey, enabled);
}

/**
 * Request listener : will give access to debug-version of js files by performing redirection.
 *
 * @param {Object} request - The request that is being listened.
 */
function onBeforeRequestListener(request) {
  const requestUrl = request.url;
  const debugUrl = requestUrl.replace(/\.js$/, '.debug.js');
  let response = {};
  if (shouldRedirectUrl(requestUrl, debugUrl, keepPattern)) {
    response.redirectUrl = debugUrl;
    console.info(`redirecting ${requestUrl} to ${debugUrl}`);
  } else {
    console.warn(`not redirecting ${requestUrl}`);
  }
  return response;
}

/**
 * Decide wether to perform redirection from originalUrl to redirectUrl.
 *
 * @param {url} originalUrl - Url to be redirected from.
 * @param {url} redirectUrl - Url to redirect to.
 * @param {pattern} pattern - If originalUrl matches this pattern, no redirection.
 */
function shouldRedirectUrl(originalUrl, redirectUrl, pattern) {
  if (originalUrl.match(pattern)) return false; // if originalUrl matches pattern, keep originalUrl
  const request = new XMLHttpRequest();
  request.open('GET', redirectUrl, false); // 'false' makes the request synchronous
  request.send(null);
  return (request.status === 200); // if redirectUrl exists keep it, otherwise use originalUrl
}
