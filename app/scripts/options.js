'use strict'


let i18n = new I18n();
// define the new options in constants
let optionManager = new OptionManager(OPTIONS);

// Init i18n
i18n.populateText();

function onFieldChange() {
	optionManager.get().then((options) => {
		options[this.name] = this.value;
		optionManager.set(options);
	})
	.catch( (e) => console.error(e) );
}

function onCheckboxChange() {
	optionManager.get().then((options) => {
		options[this.name] = this.checked;
		optionManager.set(options);
	})
	.catch( (e) => console.error(e) );
}

function onPercentageChange() {
	let buttonPercentage = this;
	if (buttonPercentage.value < 0) {
		buttonPercentage.value = 0;
	} else if (buttonPercentage.value > 100) {
		buttonPercentage.value = 100;
	}
	onFieldChange.call(buttonPercentage);
}

function onMinuteChange() {
	let buttonPercentage = this;
	if (buttonPercentage.value < 0) {
		buttonPercentage.value = 0;
	}
	onFieldChange.call(buttonPercentage);
}


// Restore options
optionManager.get().then((options) => {
	document.querySelector(`input[name="like_what"][value="${options.like_what}"]`).setAttribute("checked", "checked");
	document.querySelector(`input[name="like_timer"][value="${options.like_timer}"]`).click();
	document.querySelector(`input[name="type_timer"][value="${options.type_timer}"]`).setAttribute("checked", "checked");
	document.querySelector(`input[name="type_list"][value="${options.type_list}"]`).setAttribute("checked", "checked");
	if (options.use_list)
		document.getElementById("use_list").setAttribute("checked", "checked");
	document.getElementById(`${options.type_timer}-value`).setAttribute("value",`${options.timer_value}`);
	if (options.debug)
		document.getElementById("debug-div").setAttribute("checked", "checked");
	if (options.debug_displayed)
			document.getElementById("debug-div").classList.remove("hide-by-default");
})
.catch( (e) => console.error(e) );

// Hide button if not on video or creator page
function isVideo(url) {
	return url.indexOf("https://www.youtube.com/watch?v=") !== -1;
}

function isHome(url) {
	return url.indexOf("https://www.youtube.com/channel/") !== -1 || url.indexOf("https://www.youtube.com/user/") !== -1;
}

async function getCurrentWindowTabs() {
	return browser.tabs.query({currentWindow: true, active: true});
}

// Maybe useless for now because in manifest we have activeTab only but when switch to tabs in manifest
// this will still work
async function getActiveTab() {
	let tabs = await browser.tabs.query({currentWindow: true, active: true});
	for (let tab of tabs) {
		if (tab.active) {
			return tab;
		}
	}
}


async function callCreatorFromVideo(tab) {
	console.log("Get creator from video");
	return await browser.tabs.sendMessage(tab.id, "get_creator_from_video");
}

async function callCreatorFromHome(tab) {
	console.log("Get creator from home");
	let creator = await browser.tabs.sendMessage(tab.id, "get_creator_from_home");
	return creator
}

// async because video description may not be loaded yet
async function getThisCreator(tab) {
	let creator = undefined;
	if (isVideo(tab.url)) {
		creator = await callCreatorFromVideo(tab);
	}
	/* else if (isHome(tab.url)) {
		creator = await callCreatorFromHome(tab);
	} */
	else {
		throw "Not a video or a creator";
	}
	return creator;
}

function saveThisCreator() {
	getActiveTab().then((tab) => {
		getThisCreator(tab).then((creator) => {
			if (creator !== undefined) {
				saveCreator(creator).then( () => {
					displayAddRmButton();
				});
			}
		});
	});
}

function removeThisCreator() {
	getActiveTab().then((tab) => {
		getThisCreator(tab).then((creator) => {
			if (creator !== undefined) {
				removeCreator(creator).then( () => {
					displayAddRmButton();
				});
			}
		});
	});
}

function displayAddRmButton() {
	getActiveTab().then((tab) => {
		if (tab.url === undefined) tab.url = ""
		if (isVideo(tab.url)) {
			getThisCreator(tab).then((creator) => {
				isInList(creator).then((in_list) => {
					if ( in_list ) {
						document.getElementById("list-remove-creator").classList.remove("hide-by-default");
						document.getElementById("list-add-creator").classList.add("hide-by-default");
					} else {
						document.getElementById("list-remove-creator").classList.add("hide-by-default");
						document.getElementById("list-add-creator").classList.remove("hide-by-default");
					}
				});
			});
		}
	})
	.catch( (e) => console.error(e) );
}

/*
MAIN
*/

displayAddRmButton();

// Trigger a function when the user changes an option
document.querySelectorAll('input[type="radio"]').forEach((field) => {
	field.addEventListener( 'click', onFieldChange.bind(field) );
});

document.querySelectorAll("input[type='checkbox']").forEach((field) => {
	field.addEventListener("click", onCheckboxChange.bind(field));	
});

document.getElementById("percentage-value").addEventListener( 'input', onPercentageChange);
document.getElementById("minute-value").addEventListener( 'input', onMinuteChange);

document.getElementById("instant_like").addEventListener( 'click', () => {
	document.getElementById("options-timer").style.visibility = "hidden";
});

document.getElementById("custom_like").addEventListener( 'click', () => {
	document.getElementById("options-timer").style.visibility = "visible";
});

document.getElementById("random_like").addEventListener( 'click', () => {
	document.getElementById("options-timer").style.visibility = "hidden";
});

document.getElementById("list-manage").addEventListener( 'click', () => {
	window.open("./manage.html");
	window.close()
});

document.getElementById("list-add-creator").addEventListener( 'click', () => {
	saveThisCreator();
});

document.getElementById("list-remove-creator").addEventListener( 'click', () => {
	removeThisCreator();
});

var enable_debug = new Konami(function() {
	console.log("Konami code done !")
	optionManager.get().then((options) => {
		options.debug_displayed = !options.debug_displayed
		optionManager.set(options).then(() => {
			if (options.debug_displayed) {
				document.getElementById("debug-div").classList.remove("hide-by-default");
			} else {
				document.getElementById("debug-div").classList.add("hide-by-default");
			}
		});
	});
});
