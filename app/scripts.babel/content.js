// console.log('content script initialized')
// We need to know which version of YouTube we're dealing with
// The material version has no ID on the body, hence this dumb check
const IS_MATERIAL = !document.body.id;
const IS_GAMING = window.location.href.indexOf('//gaming.youtube') > -1;

// DEBUG: 
// ['yt-navigate', 'yt-navigate-finish', 'yt-page-data-updated'].forEach(eventType => {
//   document.querySelector('ytd-app').addEventListener(eventType, (e) => console.log(e.type))
// })

// Create an OptionManager
const defaults = {
  like_what: 'subscribed',
  like_when: 'instantly',
  disabled: false,
};
const optionManager = new OptionManager(defaults);

// Fetch our options then fire things up
optionManager.get().then(options => {
  // console.log('options loaded', options)

  if (IS_MATERIAL) {
  	const liker = new MaterialLiker(options);
    /*
    We're hooking into YouTube's custom events to determine when the video changes.
    However, YouTube Gaming's yt-navigate event doesn't fire initially.
     */
    if (IS_GAMING) {
      liker.init();
      document.querySelector('ytg-app').addEventListener('yt-page-data-updated', liker.init);
      return;
    }
    document.querySelector('ytd-app').addEventListener('yt-page-data-updated', liker.init);
  }
  else {
  	const liker = new Liker(options);
    /*
    Old YouTube is a bit clunkier.
    We need to initialize the liker immediately
    and also run it whenever the AJAX load finishes.
     */
  	liker.init();
		window.addEventListener('spfdone', liker.init);
  }
});
