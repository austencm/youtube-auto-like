/**
 * Likes YouTube videos.
 * TODO: Also have it make coffee
 */
class Liker {
	/**
	 * @param {Object} options Must have the option 'like_what', indicating
	 *                         whether to like all videos or just subscribed
	 */
	constructor(options) {
		this.options = options;
	}

	/**
	 * Clears data for another round of slick liking action
	 */
	reset() {
		this.btns = {};
	}

	/**
	 * Detects when like/dislike buttons have loaded (so we can press them)
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	waitForButtons(callback) {
		this.btns.like = document.querySelector('.like-button-renderer-like-button-unclicked');
		this.btns.dislike = document.querySelector('.like-button-renderer-dislike-button-unclicked');

		// Make sure both buttons exist
		if (this.btns.like && this.btns.dislike)
			callback();
		// Otherwise wait a second and try again
		else
			setTimeout(() => this.waitForButtons(callback), 1000 );
	}

		/**
	* Detects when the video player has loaded
	* @param  {Function} callback
	*/
	waitForVideo(callback) {
		this.video = document.querySelector('.video-stream');
		if (this.video) {
 			callback();
		} else {
			setTimeout(() => this.waitForVideo(callback), 1000);
		}
	}

	randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min);
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
		else if (this.options.like_timer == "random") {
			var video = document.getElementsByClassName('video-stream')[0];
			let duration = video.duration;

			//normally buttons load after video, but if they load before, maybe a bug can happen

			let nowInPercent = video.currentTime / duration * 100;

			if (nowInPercent >= this.randomTimerPercent) {
				callback();
			} else {
				setTimeout(() => this.waitTimer(callback), 1000 );
			}
		}
		else {
		
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
	}

	/**
	 * Take a wild guess
	 * @return {Boolean} True if the like or dislike button is active
	 */
	isVideoRated() {
		return this.btns.like.classList.contains('hid') ||
					 this.btns.dislike.classList.contains('hid');
	}

	/**
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		// Check if the subscribtion button is active
		return document.querySelector('.yt-uix-subscription-button').classList.contains('hover-enabled');
	}

	/**
	 * Clickity click the button
	 */
	attemptLike() {
			this.btns.like.click();
	}


	blockMultipleRun() {
		if (!this.hasOwnProperty("IS_STARTED")) { //if not defined this is the 1st run
			this.IS_STARTED = true;
			return;
		} else {
			if (this.IS_STARTED) {
				exit();
			} else { //could be a new video in playlist
				this.IS_STARTED = true;
				return;
			}
		}
	}

	finish() {
		this.IS_STARTED = false;
	}

	/**
	 * Starts the liking magic.
	 * The liker won't do anything unless this method is called.
	 */
	init() {
		if (this.options.like_what === "none") {
			return;
		}

		this.blockMultipleRun();
		this.reset();
		console.log('yt-autolike start');

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
				this.finish();
				return;
			}
			/*
			Else do the stuff
			*/
			// Define a random timer if selected
			if (this.options.like_timer == "random") {
				this.randomTimerPercent = this.randomIntFromInterval(0, 99);
			}

			this.waitForVideo(() => {
				this.waitTimer(() => {
					/*
					Maybe the use did an action while we was waiting, so check again
					*/
					let rated = this.isVideoRated();
					let isTrueSet = ( rated || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) );
					if ( isTrueSet ) {
						console.log("not liked check 2");
						this.finish();
						return;
					}
					this.attemptLike();
					console.log('liked');
					this.finish();
				});
			});
		});
	}
}
