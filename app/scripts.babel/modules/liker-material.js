
function closest(node, tagName) {
	var parent = node.parentNode;
	if (parent) {
		if (parent.tagName && parent.tagName.toUpperCase() === tagName.toUpperCase()) {
			return parent;
		}
		return closest(parent, tagName);
	}
}

class MaterialLiker {
    constructor(options) {
        this.options = options
    }

    reset() {
		this.icon = {}
		this.icon.like = "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"
        this.icon.dislike = "M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
		this.btns = {}
    }

    waitForButtons(callback) {
		
		if (this.icon.like != null) {
			// select the node in the info bloc that contain a like logo
			let likeElement = document.querySelectorAll('#menu.ytd-video-primary-info-renderer g path[d="' + this.icon.like +'"]')[0]
			let dislikeElement = document.querySelectorAll('#menu.ytd-video-primary-info-renderer g path[d="' + this.icon.dislike +'"]')[0]
			
			if (likeElement && dislikeElement) {
				// get the button witch contain the like to click on it
				this.btns.like = closest(likeElement, "button")
				this.btns.dislike = closest(dislikeElement, "button")
				callback()
			} else {
				setTimeout(() => this.waitForButtons(callback), 1000 )
			}
        } else {
			setTimeout(() => this.waitForButtons(callback), 1000 )
		}
    }

    isVideoRated() {
        return this.btns.like.classList.contains('style-default-active') ||
               this.btns.dislike.classList.contains('style-default-active')
    }

    isUserSubscribed() {
        let subscribeButton = document.querySelector('#subscribe-button paper-button')
        return subscribeButton && subscribeButton.hasAttribute('subscribed')
    }

    attemptLike() {
        // console.log('attempting like...')

        this.btns.like.click()
    }

    init() {
        // console.log('initializing...')

        this.reset()
        this.waitForButtons(() => {
			if ( this.isVideoRated() || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) ) {
                return
            }
            this.attemptLike()
        })
    }
}