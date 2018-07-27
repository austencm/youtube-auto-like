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
		this.options = options;
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
			this.icon.like = document.querySelector('g#like path').getAttribute('d');
			this.icon.dislike = document.querySelector('g#dislike path').getAttribute('d');
		}
		
		if (this.icon.like != null) {
			// Select the like/dislike icons using their SVG data
			let likeElement = document.querySelectorAll('#menu.ytd-video-primary-info-renderer g path[d="' + this.icon.like +'"]')[0];
			let dislikeElement = document.querySelectorAll('#menu.ytd-video-primary-info-renderer g path[d="' + this.icon.dislike +'"]')[0];
			
			// Make sure both icons exist
			if (likeElement && dislikeElement) {
				// Find and store closest buttons
				this.btns.like = likeElement.closest("button");
				this.btns.dislike = dislikeElement.closest("button");
				console.log("got buttons");
				callback();
				return;
			} else {
				console.log("wait 1s for buttons");
				setTimeout(() => this.waitForButtons(callback), 1000 );
			}
		} else {
			console.log("wait 1s for svg");
			setTimeout(() => this.waitForButtons(callback), 1000 );
		}
	}

	/*
	 * Wait the number of minutes or % specified by user
	 */
	waitTimer(callback) {
		// if Instant like, direct return to like
		if (this.options.like_timer == "instant") {
			callback();
			return;
		}
		// else continue
		
		var video = document.getElementsByClassName('video-stream')[0];
		let duration = video.duration;

		if (this.options.type_timer == "percentage") {
			//normally buttons load after video, but if they load before, maybe a bug can happen
			let percentageAtLike = this.options.timer_value;
			let nowInPercent = video.currentTime / duration * 100;
			if (nowInPercent >= percentageAtLike) {
				callback();
			} else {
				setTimeout(() => this.waitTimer(callback), 1000 );
			}
		} else if (this.options.type_timer == "minute") {
			let timeAtLike = this.options.timer_value;
			// change timeAtLike if vid shorter than time set by user
			if (video.duration < timeAtLike) {
				timeAtLike = video.duration;
			} else {
				// convert in second
				timeAtLike *= 60;
			}
			if (video.currentTime >= timeAtLike) {
				callback();
			} else {
				setTimeout(() => this.waitTimer(callback), 1000 );
			}
		}
	}

	/*
	 * Take a wild guess
	 * @return {Boolean} True if the like or dislike button is active
	 */
	isVideoRated() {
		return this.btns.like.parentNode.classList.contains("style-default-active") ||
				 this.btns.dislike.parentNode.classList.contains("style-default-active");
	}

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		let subscribeButton = document.querySelector('#subscribe-button paper-button');
		return subscribeButton && subscribeButton.hasAttribute('subscribed');
	}

	/*
	 * Clickity click the button
	 */
	attemptLike() {
		this.btns.like.click();
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

			let rated = this.isVideoRated();
			let isTrueSet = ( rated || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) );
			if ( isTrueSet ) {
				console.log("not liked check 1");
				return;
			}
			/*
			Else do the stuff
			*/
			this.waitTimer(() => {
				/*
				Maybe the use did an action while we was waiting, so check again
				*/
				let rated = this.isVideoRated();
				let isTrueSet = ( rated || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) );
				if ( isTrueSet ) {
					console.log("not liked check 2");
					return;
				}
				this.attemptLike();
				console.log('liked');
			});
		});
	}
}
