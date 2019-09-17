// We need to know which version of YouTube we're dealing with
// The material version has no ID on the body, hence this dumb check
const IS_NOT_MATERIAL = document.body.id !== "";
const IS_GAMING = window.location.hostname.indexOf('gaming.youtube') > -1; //using hostname to avoid url injection
//cannot use hostname, using regex to force starting with
const IS_TV = window.location.pathname === '/tv';
//allow to do noting on home page
const IS_CLASSIC = (window.location.hostname === 'www.youtube.com') && !IS_TV;

// Create an OptionManager
let optionManager = new OptionManager(OPTIONS);

// init de log function
var log = () => {}

// Add a listener to get the creator
browser.runtime.onMessage.addListener( function(msg, sender, sendResponse) {
	log("New message received")
	// If the received message has the expected format...
	if (msg === "get_creator_from_video") {
		// Get main video creator HTML block, if not main block is selected, others block from side video are selected
		// This children main block selection can be done each time in CSS but this is quite heavy (3 times repetition)
		let creator = getCreatorFromVideo()
		log("Sending response", creator)
		sendResponse(creator);
	} else if (msg == "get_creator_from_home") {
		// too complicated to get the channel URL, this is not consisten between user
		// and channel. HTML code not always as the channel_id in etc.
		// channel exemple: https://www.youtube.com/channel/UC7tD6Ifrwbiy-BoaAHEinmQ
	}
});

// Fetch our options then fire things up
optionManager.get().then((options) => {
	// set the real log function once options are loaded
	log = options.debug ? console.log.bind(console) : function () {};
	log("auto like injected");
	if (IS_NOT_MATERIAL) {
		log("old youtube detected");
		console.error("youtube-auto-like do not support old youtube layout anymore")
	} else {
		let liker = new MaterialLiker(options);
		if (IS_CLASSIC) {
			log("material youtube detected");

			liker.init();
			document.addEventListener('yt-page-data-updated', () => liker.init() );
		} else if (IS_GAMING) {
			log("gaming youtube detected");

			liker.init();
			document.querySelector('ytg-app').addEventListener('yt-page-data-updated', () => liker.init() );
		} else if (IS_TV) {
			log("tv youtube detected");
		}
	}
});

