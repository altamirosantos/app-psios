
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = require('structured-clone');
}
