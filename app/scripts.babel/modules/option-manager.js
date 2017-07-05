class OptionManager {
	constructor(defaults) {
		this.defaults = defaults;
	}

	get() {
        return new Promise((resolve, reject) => {
            let defaults = this.defaults
            chrome.storage.sync.get( { options: defaults }, (items) => resolve(items.options) )
        })
    }

    set(options) {
    	return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ options }, resolve)
        })
    }
 }