// We need to know which version of YouTube we're dealing with
// The material version has no ID on the body, hence this dumb check
const IS_NOT_MATERIAL = document.body.id !== "";
const IS_GAMING = window.location.hostname.indexOf('gaming.youtube') > -1; //using hostname to avoid url injection
//cannot use hostname, using regex to force starting with
const IS_TV = window.location.pathname === '/tv';
//allow to do noting on home page
const IS_CLASSIC = (window.location.pathname === '/watch') && !IS_GAMING;

// Create an OptionManager
let optionManager = new OptionManager(OPTIONS);

// Fetch our options then fire things up
optionManager.get().then((options) => {
	console.log("auto like injected");
	if (IS_NOT_MATERIAL) {
		console.log("old youtube detected");

		let liker = new Liker(options);
		liker.init();
		window.addEventListener('spfdone', () => liker.init() );
	} else {
		let liker = new MaterialLiker(options);
		if (IS_CLASSIC) {
			console.log("material youtube detected");

			liker.init();
			document.addEventListener('yt-page-data-updated', () => liker.init() );
		} else if (IS_GAMING) {
			console.log("gaming youtube detected");

			liker.init();
			document.querySelector('ytg-app').addEventListener('yt-navigate', () => liker.init() );
		} else if (IS_TV) {
			console.log("tv youtube detected");
		}
	}
});
