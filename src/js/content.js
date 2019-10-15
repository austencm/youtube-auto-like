import env from 'utils/env';
import Liker from './content/liker';
import MaterialLiker from './content/liker-material';
import OptionManager from './utils/option-manager';
import Debug from './content/debug';
import serialize from './utils/serialize';

const debug = new Debug();

// We need to know which version of YouTube we're dealing with
// The material version has no ID on the body, hence this dumb check
const IS_MATERIAL = !document.body.id;
const IS_GAMING = window.location.href.indexOf('//gaming.youtube') > -1;
debug.log('YouTube variant:', IS_GAMING ? 'gaming' : (IS_MATERIAL ? 'material' : 'classic'));

debug.log('navigated:', window.location.href);
['yt-navigate', 'yt-navigate-finish', 'yt-page-data-updated'].forEach(eventType => {
  document.querySelector('ytd-app').addEventListener(eventType, e => {
    debug.log('event:', e.type);
    if (eventType === 'yt-navigate-finish') {
      debug.log('navigated:', window.location.href);
    }
  });
});

const init = () => {
  // Create an OptionManager
  const defaults = {
    like_what: 'subscribed',
    like_when: 'instantly',
    disabled: false,
  };
  const optionManager = new OptionManager(defaults);

  // Fetch our options then fire things up
  debug.log('loading options...');

  optionManager.get().then(options => {
    debug.log('...options loaded', `(${serialize(options)})`);

    if (IS_MATERIAL) {
    	const liker = new MaterialLiker({ options, log: debug.log });
      liker.onStop = debug.save;
      if (env.DEBUG) {
        window.Liker = liker;
      }
      /*
      We're hooking into YouTube's custom events to determine when the video changes.
      However YouTube Gaming's yt-navigate event doesn't fire initially.
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
}

// For some reason Webpack bundles the imports in this file in wrong order
// which causes issues when we try to use the OptionManager. This is a fix
// until I can figure out why.
setTimeout(init, 0);
