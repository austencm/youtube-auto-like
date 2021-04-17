import Liker from './content/liker';
import MaterialLiker from './content/liker-material';
import OptionManager from './utils/option-manager';
import Debug from './content/debug';
import serialize from './utils/serialize';

const debug = new Debug();


(async function() {
  try {
    // We need to know which version of YouTube we're dealing with
    // The material version has no ID on the body, hence this dumb check
    const IS_MATERIAL = !document.body.id;
    debug.log('YouTube variant:', IS_MATERIAL ? 'material' : 'classic');
    debug.log('navigated:', window.location.href);
    if (process.env.NODE_ENV === 'development') {
      ['yt-navigate', 'yt-navigate-finish', 'yt-page-data-updated'].forEach(eventType => {
        const appRoot = document.querySelector('ytd-app');
        appRoot && appRoot.addEventListener(eventType, e => {
          debug.log('event:', e.type);
          if (eventType === 'yt-navigate-finish') {
            debug.log('navigated:', window.location.href);
          }
        });
      });
    }

    // Create an OptionManager
    const defaults = {
      like_what: 'subscribed',
      like_when: 'instantly',
      disabled: false,
    };
    const optionManager = new OptionManager(defaults);

    // Fetch our options then fire things up
    debug.log('loading options...');
    const options = await optionManager.get();
    debug.log('...options loaded', `(${serialize(options)})`);

    if (IS_MATERIAL) {
    	const liker = new MaterialLiker({ options, log: debug.log });
      liker.onStop = debug.save;
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
  }
  catch(err) {
    debug.log(err);
  }
  finally {
    debug.save();
  }
})();
