class OptionManager {
	constructor(defaults) {
		this.defaults = defaults;
	}

	get() {
        return new Promise((resolve, reject) => {
            let defaults = this.defaults
            browser.storage.sync.get( { options: defaults }, (items) => resolve(items.options) )
        })
    }

    set(options) {
    	return new Promise((resolve, reject) => {
            browser.storage.sync.set({ options }, resolve)
        })
    }
 }