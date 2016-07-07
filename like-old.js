(function() {
    'use strict';


    function init() {
      console.log('initializing');

      // Is user logged in?
      console.log(document, document.body);
      if ( !document.body.classList.contains('yt-user-logged-in') )
        return;

      var likeButton = document.querySelector('.like-button-renderer-like-button-unclicked');
      // Is video already liked?
      if ( likeButton.classList.contains('hid') )
        return;

      var options = null,
        channel = document.querySelector('#watch7-user-header .yt-user-info > a.g-hovercard').textContent.trim(),
        subscribedChannels = null;


      chrome.storage.sync.get({
        likeWhat: 'subscribed',
      }, function(options) {

        waitForGuide(function() {
          switch(options.likeWhat) {
            case 'all':
              like();
              break;
            case 'subscribed':
              if ( isUserSubscribed() ) {
                like();
              }
              break;
            case 'none':
              break;
            default:
              console.warn('There doesn\'t seem to be an auto like option set. Go to the auto like options to choose which videos to like.');
          }
        });

      });
    }

    function isUserSubscribed() {
      subscribedChannels = document.querySelectorAll('#guide-channels .display-name span');

      if (subscribedChannels) {
        // Compare the video's channel to the user's subscribed channels
        for (var i = 0; i < subscribedChannels.length; i++) {
          if (subscribedChannels[i].textContent.trim() === channel) {
            return true;
          }
        }
      }

      return false;
    }

    function waitForGuide(callback) {
      var guide = document.getElementById('guide');
      if (document.getElementById('guide-channels')) {
        callback();
        return;
      }

      // Watch for changes in the guide container so we know when the user's subscriptions are loaded
      var observeConfig = {
            childList: true,
            subtree: true
          },
          observer = new MutationObserver(function(mutations) {
            callback();
          });

      observer.observe(guide, observeConfig);
    }

    function like() {
      console.log('clicking like');
      likeButton.click();
    }

    window.addEventListener('hashchange', function() { console.log('hash change')}, false);


    init();//window.addEventListener('load', init, false);



})();