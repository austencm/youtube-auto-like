(function() {
    'use strict';

    var options = null,
        interval = null,
        likeButton = null;

    function init() {
      // Is the user logged in?
      if ( !document.body.classList.contains('yt-user-logged-in') ) {
        return;
      }

      // Stop the script if the user clicks a like/dislike button so we don't override them
      document.body.addEventListener('click', function(e) {
        var classes = e.target.classList;
        if ( (classes.contains('like-button-renderer-like-button') ||
              classes.contains('like-button-renderer-dislike-button') ) &&
              e.screenX && e.screenY) {
          stop();
        }
      });

      // Fetch our options
      chrome.storage.sync.get({
        likeWhat: 'subscribed',
      }, function(items) {
        options = items;

        if (options.likeWhat && options.likeWhat !== 'none') {
          // Try to like the video every second
          interval = setInterval(attemptLike, 1000);
        }
      });
    }

    function attemptLike() {
      likeButton = document.querySelector('.like-button-renderer-like-button-unclicked');
      if ( !likeButton || isLiked() )
        return;

      switch (options.likeWhat) {
        case 'subscribed':
          if ( !isUserSubscribed() )
            break;
        case 'all':
          likeButton.click();
          hideSharePanel();
          break;
      }
    }

    function isLiked() {
      return likeButton.classList.contains('hid');
    }

    function isUserSubscribed() {
      var channel = document.querySelector('#watch7-user-header .yt-user-info > a.g-hovercard');
      if (channel)
        channel = channel.textContent.trim();
      else
        return false;

      var subscribedChannels = document.querySelectorAll('#guide-channels .display-name span');
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

    function hideSharePanel() {
      setTimeout(function() {
        var sharePanel = document.querySelector('#watch-action-panels');
        sharePanel.classList.add('hid');
      }, 0);
    }

    function stop() {
      clearInterval(interval);
    }


    window.addEventListener('DOMContentLoaded', init);

})();