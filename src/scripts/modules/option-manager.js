/*
 * Wrapper around the storage API for easy storing/retrieving of option data
 * Handles defaults based on a configuration object initially provided
 * Stores data under (surprise!) the key 'options'
 */
class OptionManager {
	/**
	 * @param  {Object} defaults Figure it out
	 */
	constructor(defaults) {
		this.defaults = defaults;
	}

	/**
	 * Retrieve all options
	 * @return {Promise} Contains options object on resolve
	 */
	get() {
		return browser.storage.local.get(this.defaults);
	}

	/*
	 * Set options
	 * @param {Object} options Key-value pairs of options to set
	 * @return {Promise} Will resolve when successful
	 */
	set(options) {
		return browser.storage.local.set(options);
	}
 }
