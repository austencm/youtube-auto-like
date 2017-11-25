'use strict'


let i18n = new I18n();
// define the new options in constants
let optionManager = new OptionManager(OPTIONS);

// Init i18n
i18n.populateText();

function onFieldChange() {
	optionManager.get().then((options) => {
		options[this.name] = this.value
		optionManager.set(options)
	})
}

// Restore options
optionManager.get().then((options) => {
	document.querySelector(`input[name="like_what"][value="${options.like_what}"]`).setAttribute("checked", "checked");
	document.querySelector(`input[name="like_timer"][value="${options.like_timer}"]`).click();
	document.querySelector(`input[name="type_timer"][value="${options.type_timer}"]`).setAttribute("checked", "checked");;
});

// Trigger a function when the user changes an option
document.querySelectorAll('input').forEach((field) => {
	field.addEventListener( 'click', onFieldChange.bind(field) );
});

document.getElementById("instant_like").addEventListener( 'click', () => {
	document.getElementById("options-timer").style.visibility = "hidden";
});


document.getElementById("custom_like").addEventListener( 'click', () => {
	document.getElementById("options-timer").style.visibility = "visible";
});