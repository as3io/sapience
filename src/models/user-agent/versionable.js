const compose = require('@stamp/it');

module.exports = compose({
  /**
   *
   */
  init({ version }) {
    this.v = version;
    if (version) [this.mj, this.mn] = version.split('.');
  },
});
