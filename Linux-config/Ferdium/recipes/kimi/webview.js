const path = require('path');

module.exports = Ferdium => {
  Ferdium.injectJSUnsafe(path.join(__dirname, 'callback-relay.js'));
};
