import Liker from './content/liker';
import OptionManager from './utils/option-manager';
import Debug from './content/debug';

const debug = new Debug();

(async function () {
  try {
    debug.log('navigated:', window.location.href);

    if (process.env.NODE_ENV === 'development') {
      ['yt-navigate', 'yt-navigate-finish', 'yt-page-data-updated'].forEach((eventType) => {
        const appRoot = document.querySelector('ytd-app');

        if (appRoot) {
          appRoot.addEventListener(eventType, (e) => {
            debug.log('event:', e.type);

            if (eventType === 'yt-navigate-finish') {
              debug.log('navigated:', window.location.href);
            }
          });
        }
      });
    }

    // Create an OptionManager
    const defaults = {
      like_what: 'subscribed',
      like_when: 'instantly',
      like_when_minutes: '2',
      like_when_percent: '50',
      disabled: false,
    };
    const optionManager = new OptionManager(defaults);

    // Fetch our options then fire things up
    debug.log('loading options...');

    const options = await optionManager.get();

    debug.log('...options loaded', `(${JSON.stringify(options, null, 2)})`);

    const liker = new Liker({ options, log: debug.log });
    liker.onPause = debug.save;
  } catch (err) {
    debug.log(err);
  } finally {
    debug.save();
  }
})();
