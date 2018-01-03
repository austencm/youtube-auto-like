
// We need to know which version of YouTube we're dealing with
// The material version has no ID on the body, hence this dumb check
const IS_MATERIAL = !document.body.id;

// Create an OptionManager
const defaults = {
  like_what: 'subscribed',
  like_when: 'instantly',
  disabled: false,
};
const optionManager = new OptionManager(defaults);

// Fetch our options then fire things up
optionManager.get().then(options => {
  if (IS_MATERIAL) {
  	const liker = new MaterialLiker(options);
    /*
    Hook into one of YouTube's custom events;
    This fires when page changes, so the liker is run only when needed.
     */
  	document.addEventListener('yt-page-data-updated', liker.init);
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
