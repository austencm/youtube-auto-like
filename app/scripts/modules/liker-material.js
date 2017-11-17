/*
 * Likes YouTube videos.
 * For the newer material design layout
 */
class MaterialLiker {
	/*
	 * @param {Object} options Must have the option 'like_what', indicating
	 *                         whether to like all videos or just subscribed
	 */
	constructor(options) {
		this.options = options
	}

	reset() {
		this.icon = {}
		this.btns = {}
	}

	/*
	 * Detects when like/dislike buttons have loaded (so we can press them)
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	waitForButtons(callback) {
		if (this.icon.like == null) {
			// get the SVG pattern
			this.icon.like = document.querySelector('g#like path').getAttribute('d')
			this.icon.dislike = document.querySelector('g#dislike path').getAttribute('d')
		}
		
		if (this.icon.like != null) {
			// Select the like/dislike icons using their SVG data
			let likeElement = document.querySelectorAll('#menu.ytd-video-primary-info-renderer g path[d="' + this.icon.like +'"]')[0]
			let dislikeElement = document.querySelectorAll('#menu.ytd-video-primary-info-renderer g path[d="' + this.icon.dislike +'"]')[0]
			
			// Make sure both icons exist
			if (likeElement && dislikeElement) {
				// Find and store closest buttons
				this.btns.like = likeElement.closest("button");
				this.btns.dislike = dislikeElement.closest("button");
				callback()
			} else {
				setTimeout(() => this.waitForButtons(callback), 1000 );
			}
		} else {
			setTimeout(() => this.waitForButtons(callback), 1000 );
		}
	}

	/*
	 * Take a wild guess
	 * @return {Boolean} True if the like or dislike button is active
	 */
	isVideoRated() {
		return this.btns.like.parentNode.getAttribute("aria-pressed") ||
				 this.btns.dislike.parentNode.getAttribute("aria-pressed")
	}

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		let subscribeButton = document.querySelector('#subscribe-button paper-button')
		return subscribeButton && subscribeButton.hasAttribute('subscribed')
	}

	/*
	 * Clickity click the button
	 */
	attemptLike() {
		this.btns.like.click()
	}

	/*
	 * Starts the liking.
	 * The liker won't do anything unless this method is called.
	 */
	init() {
		this.reset()
		console.log('yt-autolike start')
		this.waitForButtons(() => {
			/*
			If the video is already liked/disliked
			or the user isn't subscribed to this channel,
			then we don't need to do anything.
			 */
			var isTrueSet = ( (this.isVideoRated() == 'true') || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) );
			if ( isTrueSet ) {
				console.log("not liked")
				return
			}
			this.attemptLike()
			console.log('liked')
		})
	}
}