'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *
 * Environment Config
 *
 */

var env = {
  production: {
    name: 'production',
    port: 4000
  },
  dev: {
    name: 'dev',
    port: 4000
  },
  test: {
    name: 'test',
    port: 4000
  }
};
exports.default = env[process.env.NODE_ENV];
//# sourceMappingURL=env.js.map