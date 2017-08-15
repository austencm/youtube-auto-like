
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
        this.btns = {}
    }

    waitForButtons(callback) {
		if (this.icon.like == null) {
			// get the icon
			this.icon.like = document.querySelector('g#like path').getAttribute('d')
			this.icon.dislike = document.querySelector('g#dislike path').getAttribute('d')
		}
		
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
		console.log('plop')
        this.waitForButtons(() => {
			console.log('ok')
            if ( this.isVideoRated() || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) ) {
                return
            }
			console.log('e')
            this.attemptLike()
        })
    }
}