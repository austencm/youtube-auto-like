async function saveCreator(creator) {
	console.log("Saving this creator")
	console.log("Retrieving saved creators")
	return new Promise((resolve, reject) => {
		optionManager.get().then((options) => {
			let array = options["creator_list"];
			console.log("Actual creator list", array)
			if (!array.find(o => o.URL === creator.URL )) {  //compare only with URL, creator may change their name
				array.push(creator)
				console.log("Saving the updated creator list", array)
				optionManager.set( options ).then( () => resolve() )
			} else {
				console.log("Creator already exist")
			}
		});
	});
}

function removeCreator(creator) {
	console.log("removeCreator called")
	console.log(creator)
	return new Promise((resolve, reject) => {
		optionManager.get().then((options) => {
			let array = options["creator_list"];
			for (var i = 0; i < array.length; i++) {
				console.log(array[i])
				if (areCreatorsEquals(array[i], creator)) {
					console.log("Creator found")
					array.splice(i, 1)
					console.log(array)
					optionManager.set( options ).then( () => resolve() )
					return
				} else {
					console.log("Creator are not equals")
				}
			}
		});
	});
}

function areCreatorsEquals(x, y) {
	console.log("Starting comparaison for ", x, y)
	// If the property are not present, return false
	if (!x.hasOwnProperty("name") || !y.hasOwnProperty("name")) {
		console.log("No prop 'name'")
		return false;
	}
	if (!x.hasOwnProperty("URL") || !y.hasOwnProperty("URL")) {
		console.log("No prop 'URL'")
		return false;
	}

	// If properties are not equal, return false
	if (x.name !== y.name) {
		console.log("name is different");
		return false;
	}
	if (x.URL !== y.URL) {
		console.log("URL is different");
		return false;
	}

	console.log("Creator are equals")
	return true; 
}

function getCreatorFromVideo() {
	let creatorBlock = document.querySelector("#container.ytd-video-secondary-info-renderer");
	let name = creatorBlock.querySelector("yt-formatted-string.ytd-channel-name>a").textContent;
	let URL = creatorBlock.querySelector("yt-formatted-string.ytd-channel-name>a").href;
	return {name, URL};
}

async function isInList(creator) {
	console.log("Checking if creator is in list", creator)
	let options = await optionManager.get();
	let in_list = false;
	let creator_list = options.creator_list;
	for (var i = 0; i < creator_list.length; i++) {
		if (areCreatorsEquals(creator_list[i], creator)) {
			in_list = true;
			break;
		}
	}
	console.log("isInList return", in_list)
	return in_list;
}
