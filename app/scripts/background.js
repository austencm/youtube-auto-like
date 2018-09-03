/*
 * Script running in background for the plugin
 * Currently detect update, and smooth transition between versions
 */
function isNewVersion(stored_version, manifest_version) {
	for (var i = 0; i <= stored_version.split(".").length - 1; i++) {
		console.log(stored_version.split(".")[i])
		console.log( manifest_version.split(".")[i])
		if (stored_version.split(".")[i] < manifest_version.split(".")[i]) {
			return true;
		}
	}
	return false;
}

function handleInstalled(details) {
	let optionManager = new OptionManager(OPTIONS);
	optionManager.get().then((options) => {
		// if this is a new version display patch note
		if ( isNewVersion(options.plugin_version, browser.runtime.getManifest().version) ) {
				browser.tabs.create({
				url: "update_info.html"
			});
			// save the new version number
			options.plugin_version = browser.runtime.getManifest().version;
			optionManager.set(options);
		}
		//browser.storage.local.clear();
	});	
}
// triggered when new  version installed
browser.runtime.onInstalled.addListener(handleInstalled);
