
// We need to know which version of YouTube we're dealing with
// The material version has no ID on the body, hence this dumb check
const IS_MATERIAL = !document.body.id

// Create an OptionManager
let optionManager = new OptionManager(OPTIONS);

// Fetch our options then fire things up
optionManager.get().then((options) => {
	let liker = new MaterialLiker(options)
	/*
	Hook into one of YouTube's custom events.
	This fires when page changes, so the liker is run only when needed.
	 */
	document.addEventListener('yt-page-data-updated', () => liker.init() );
});
