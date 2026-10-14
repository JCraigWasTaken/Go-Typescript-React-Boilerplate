/**
 * Jest test environment: jsdom plus the Node runtime's native Web fetch APIs.
 *
 * msw 2 intercepts fetch at the undici level and reads mocked response
 * bodies through the global fetch/Response objects. The plain jsdom
 * environment only provides the XHR-based whatwg-fetch polyfill (installed
 * by react-app-polyfill), through which msw 2's mocked response bodies come
 * back empty, so response.json() throws in the tests.
 *
 * This environment copies the Node runtime's native implementations
 * (undici-based, the same engine as browser fetch) onto the jsdom globals
 * and stashes them on `__nodeWebApis`. setupTests.ts re-applies the stash,
 * because react-app-polyfill's whatwg-fetch overwrites the globals after
 * the environment constructor has run.
 */
const JsdomModule = require('jest-environment-jsdom');
// Jest 27 (CRA 5) exports the class directly; newer versions expose .TestEnvironment.
const JsdomEnvironment =
  typeof JsdomModule === 'function' ? JsdomModule : JsdomModule.TestEnvironment;

const NODE_WEB_APIS = [
  'fetch',
  'Request',
  'Response',
  'Headers',
  'FormData',
  'Blob',
  'File',
  'AbortController',
  'AbortSignal',
  'structuredClone',
];

class NodeFetchJSDOMEnvironment extends JsdomEnvironment {
  constructor(config, context) {
    super(config, context);
    const stashed = {};
    for (const name of NODE_WEB_APIS) {
      if (typeof globalThis[name] !== 'undefined') {
        stashed[name] = globalThis[name];
        this.global[name] = globalThis[name];
      }
    }
    this.global.__nodeWebApis = stashed;
  }
}

module.exports = NodeFetchJSDOMEnvironment;
