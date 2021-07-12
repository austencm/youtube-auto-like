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
	}

  /**
   * Retreive all options
   * @return {Promise} Contains options object on resolve
   */
	get() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get({ options: this.defaults }, items => resolve(items.options));
    });
  }

  /**
   * Set options
   * @param {Object} options Key-value pairs of options to set
   * @return {Promise}
   */
  set(options) {
  	return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ options }, resolve);
    });
  }
}
