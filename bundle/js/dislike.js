(function() {
    'use strict';

    var IS_MATERIAL = false,
        options = null,
        interval = null,
        dislikeButton = null;

    function init() {
        IS_MATERIAL = !document.body.id

        // Is the user logged in?
        if ((!IS_MATERIAL && !document.body.classList.contains('yt-user-logged-in'))) {
            return;
        }


        // Stop the script if the user clicks a like/dislike button so we don't override them

        document.body.addEventListener('click', function(e) {
            if (IS_MATERIAL) {
                if ( ( ( ( dislikeButton === e.target || dislikeButton.contains(e.target) ) && !isDisliked() ) ||
                    ( dislikeButton.nextElementSibling === e.target || dislikeButton.nextElementSibling.contains(e.target)))
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
            dislikeWhat: 'subscribed',
        }, function(items) {
            options = items;

            if (options.dislikeWhat && options.dislikeWhat !== 'none') {
                // Try to dislike the video every second
                interval = setInterval(attemptDislike, 1000);
            }
        });
    }

    function attemptDislike() {
        if (IS_MATERIAL) {
            dislikeButton = document.querySelector('#icon[alt^="dislike this"]').parentNode.parentNode.parentNode
        }
        else
            dislikeButton = document.querySelector('.like-button-renderer-dislike-button-unclicked')

        if (!dislikeButton || isDisliked())
            return

        switch (options.dislikeWhat) {
            case 'subscribed':
                if (!isUserSubscribed())
                    break;
            case 'all':
                dislikeButton.click();
                if (!IS_MATERIAL)
                    hideSharePanel();
                break;
        }
    }

    function isDisliked() {
        return IS_MATERIAL ?
            dislikeButton.classList.contains('style-default-active') :
            dislikeButton.classList.contains('hid')
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
