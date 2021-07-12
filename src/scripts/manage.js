'use strict'


let i18n = new I18n();
// define the new options in constants
let optionManager = new OptionManager(OPTIONS);

// Init i18n
i18n.populateText();

optionManager.get().then((options) => {
	console.log(options)
	let tbl = document.getElementById("creator_list");
	for(var i = 0; i < options["creator_list"].length; i++) {
		let creator = options["creator_list"][i]
        let tr = tbl.insertRow();

        let td_name = tr.insertCell();
        td_name.classList.add("name-box");
        td_name.appendChild(document.createTextNode(creator.name));

        let td_URL = tr.insertCell();
        td_URL.classList.add("url-box");
        let a = document.createElement('a');
        let link_text = document.createTextNode(creator.URL);
        a.appendChild(link_text)
        a.href = creator.URL
        td_URL.appendChild(a);

        let td_rm = tr.insertCell();
        td_rm.classList.add("rm-box");
        let button = document.createElement('button');
        button.classList.add("box");
		button.innerHTML = "<svg class='icon-close'><use xlink:href='#icon-close'></use></svg>";
		button.name = creator.name
		button.value = creator.URL
		button.onclick = function() {
			let creator = {"name": this.name, "URL": this.value}
			removeCreator(creator)
			this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)
		}
		td_rm.appendChild(button)
    }
})
.catch( (e) => console.error(e) );
