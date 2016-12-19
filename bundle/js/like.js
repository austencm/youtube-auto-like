(function() {
    'use strict';

    var IS_MATERIAL = false,
        options = null,
        interval = null,
        likeButton = null;

    function init() {
        IS_MATERIAL = !document.body.id

        // Is the user logged in?
        if ((!IS_MATERIAL && !document.body.classList.contains('yt-user-logged-in'))) {
            return;
        }


        // Stop the script if the user clicks a like/dislike button so we don't override them

        document.body.addEventListener('click', function(e) {
            if (IS_MATERIAL) {
                if ( ( ( ( likeButton === e.target || likeButton.contains(e.target) ) && !isLiked() ) ||
                    ( likeButton.nextElementSibling === e.target || likeButton.nextElementSibling.contains(e.target)))
                    && e.screenX && e.screenY) {
                    stop();
                }
            } else {
                var classes = e.target.classList;
                if ( ( classes.contains('like-button-renderer-like-button') ||
                       classes.contains('like-button-renderer-dislike-button') ) &&
                       e.screenX && e.screenY) {
                    stop();
                }
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
        if (IS_MATERIAL) {
            likeButton = document.querySelector('#icon[alt^="like this"]').parentNode.parentNode.parentNode
        }
        else
            likeButton = document.querySelector('.like-button-renderer-like-button-unclicked')

        if (!likeButton || isLiked())
            return

        switch (options.likeWhat) {
            case 'subscribed':
                if (!isUserSubscribed())
                    break;
            case 'all':
                likeButton.click();
                if (!IS_MATERIAL)
                    hideSharePanel();
                break;
        }
    }

    function isLiked() {
        return IS_MATERIAL ?
            likeButton.classList.contains('style-default-active') :
            likeButton.classList.contains('hid')
    }

    function isUserSubscribed() {
        if (IS_MATERIAL) {
            var subscribeButton = document.querySelector('#subscribe-button paper-button')
            return subscribeButton && subscribeButton.hasAttribute('subscribed')
        }
        else
            return document.querySelector('.yt-uix-subscription-button').classList.contains('hover-enabled')
    }

    function hideSharePanel() {
        setTimeout(function() {
            var sharePanel = document.querySelector('#watch-action-panels');
            if (sharePanel)
                sharePanel.classList.add('hid');
        }, 0);
    }

    function stop() {
        clearInterval(interval);
    }


    window.addEventListener('DOMContentLoaded', init);

})();
