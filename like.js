(function() {
    'use strict';

    // Is user logged in?
    if ( !document.body.classList.contains('yt-user-logged-in') )
      return;

    var likeButton = document.querySelector('.like-button-renderer-like-button-unclicked');
    // Is video already liked?
    if ( likeButton.classList.contains('hid') )
      return;

    var channel = document.querySelector('#watch7-user-header .yt-user-info > a.g-hovercard').textContent.trim(),
        subscribedChannels = null,
        // Watch for changes in the guide container so we know when the user's subscriptions are loaded
        observeNode = document.getElementById('guide'),
        observeConfig = {
          childList: true,
          subtree: true
        },
        observer = new MutationObserver(function(mutations) {

          subscribedChannels = document.querySelectorAll('#guide-channels .display-name span');

          if (subscribedChannels) {
            // Compare the video's channel to the user's subscribed channels
            for (var i = 0; i < subscribedChannels.length; i++) {
              if (subscribedChannels[i].textContent.trim() === channel) {
                likeButton.click();
                break;
              }
            }
          }

        });

    observer.observe(observeNode, observeConfig);

})();