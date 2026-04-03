/**
 * Wrapper around the storage API for easy storing/retrieving of option data
 * Handles defaults based on a configuration object initially provided
 * Stores data under the key 'options'
 */
export default class OptionManager {
  /**
   * @param  {Object} defaults
   */
  constructor(defaults) {
    this.defaults = defaults;

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.normalize = this.normalize.bind(this);
  }

  normalize(options = {}) {
    const mergedOptions = {
      ...this.defaults,
      ...options,
    };

    return {
      ...mergedOptions,
      disabled: mergedOptions.disabled === true,
      like_when_minutes: String(mergedOptions.like_when_minutes),
      like_when_percent: String(mergedOptions.like_when_percent),
    };
  }

  /**
   * Retrieve all options
   * @return {Promise} Contains options object on resolve
   */
  get() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({ options: this.defaults }, ({ options }) => {
        resolve(this.normalize(options));
      });
    });
  }

  /**
   * Set options
   * @param {Object} options Key-value pairs of options to set
   * @return {Promise}
   */
  async set(options) {
    const currentOptions = await this.get();
    const normalizedOptions = this.normalize({
      ...currentOptions,
      ...options,
    });

    return new Promise((resolve) => {
      chrome.storage.sync.set({ options: normalizedOptions }, resolve);
    });
  }
}
