/*
 * Likes YouTube videos.
 * For the newer material design layout
 */
class MaterialLiker {
	/*
	 * @constructor
	 * @param {OptionManager} options Object that must have the option 
	 *     'like_what', indicating whether to like all videos or just 
	 *      subscribed.
	 */
	constructor(options) {
		this.options = options;
		/*
		Youtube gaming hasn't the svg path in code like youtube
		*/
		this.iconSvgData = {
			like: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z',
			dislike: 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z'
		};
		this.icon = {}
		this.btns = {}
	}

	async update_options() {
		this.options = await optionManager.get();
		log("options updated");
		return;
	}

	/**
	 * Reset the attributes
	 */
	reset() {
		this.icon = {}
		this.btns = {}
	}

	/**
	 * Detects when like/dislike buttons have loaded (so we can press them)
	 * and register element in the attributes
	 * @param {function} callback The function to execute after the buttons
	 *     have loaded
	 */
	waitForButtons(callback) {
		if (this.icon.like == null && IS_CLASSIC) {
			// get the SVG pattern
			this.icon.like = document.querySelector('g#like path')
				.getAttribute('d');
			this.icon.dislike = document.querySelector('g#dislike path')
				.getAttribute('d');
		} else {
			// else use the stored one
			this.icon.like = this.iconSvgData.like;
			this.icon.dislike = this.iconSvgData.dislike;
		}

		if (this.icon.like != null) {
			// Select the like button of the main video
			let likeElement = document.querySelector(
				`ytd-video-primary-info-renderer g.yt-icon path[d="${this.icon.like}"], g.iron-icon path[d="${this.icon.like}"]`
			);
			let dislikeElement = document.querySelector(
				`ytd-video-primary-info-renderer g.yt-icon path[d="${this.icon.dislike}"], g.iron-icon path[d="${this.icon.dislike}"]`
			);
			
			// Make sure both icons exist
			if (likeElement && dislikeElement) {
				// Find and store closest buttons
				this.btns.like = likeElement
					.closest('yt-icon-button, paper-icon-button');
				this.btns.dislike = dislikeElement
					.closest('yt-icon-button, paper-icon-button');
				log("got buttons");
				callback();
			} else {
				log("wait 1s for buttons");
				setTimeout(() => this.waitForButtons(callback), 1000 );
			}
		} else {
			log("wait 1s for svg");
			setTimeout(() => this.waitForButtons(callback), 1000 );
		}
	}

	/**
	* Detects when the video player has loaded
	* @param  {function} callback The function to execute once the video has
	*     loaded.
	*/
	waitForVideo(callback) {
		this.video = document.querySelector('.video-stream');
		if (this.video) {
 			callback();
		} else {
			setTimeout(() => this.waitForVideo(callback), 1000);
		}
	}

	/**
	 * Return a random integer in a given range
	 * @param {number} min An integer representing the start of the range
	 * @param {number} max An integer representing the end of the range
	 * @return {number} The random integer selected in the range
	 */
	randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/**
	 * Wait the number of minutes or % specified by user in the plugin option
	 * @param {function} callback The function to execute at the end of 
	 *     the timer
	 */
	waitTimer(callback) {
		// if Instant like, direct return to like
		if (this.options.like_timer == "instant") {
			callback();
			return;
		} 
		else if (this.options.like_timer == "random") {
			let duration = this.video.duration;

			let nowInPercent = this.video.currentTime / duration * 100;

			if (nowInPercent >= this.randomTimerPercent) {
				callback();
			} else {
				setTimeout(() => this.waitTimer(callback), 1000 );
			}
		}
		else {
			let duration = this.video.duration;

			if (this.options.percentage_timer) {
				let percentageAtLike = this.options.percentage_value;
				let nowInPercent = this.video.currentTime / duration * 100;

				if (nowInPercent >= percentageAtLike) {
					callback();
					return;
				}
			}

			if (this.options.minute_timer) {
				let timeAtLike = this.options.minute_value;
				// change timeAtLike if vid shorter than time set by user
				if (this.video.duration < timeAtLike) {
					timeAtLike = this.video.duration;
				} else {
					// convert in second
					timeAtLike *= 60;
				}
				if (this.video.currentTime >= timeAtLike) {
					callback();
					return;
				}
			}

			// if both are disable event if custom timer is set
			if (!this.options.minute_timer && !this.options.percentage_timer) {
				// instant like
				callback();
				return;
			}

			setTimeout(() => this.waitTimer(callback), 1000 );
		}
	}

	/**
	 * Wait the video time indicator is greater the timer
	 * @param {int} timer The time in second to wait
	 * @param {function} callback The function to execute when timer is over
	 */
	waitTimerTwo(timer, callback) {
		if (this.video.currentTime >= timer) {
			callback();
			return;
		}
		setTimeout(() => this.waitTimerTwo(timer, callback), 1000);
	}

	/**
	 * Check timer not greater than video length and wait the video 
	 * time indicator to be greater than the seconds requested
	 * @param {int} timer The time in second to wait
	 * @param {function} callback The function to execute when timer is over
	 */
	startTimer(timer, callback) {
		let duration = this.video.duration;
		// change timer if vid shorter than time requested
		if (duration < timer) {
			timer = duration;
		}
		this.waitTimerTwo(timer, callback)

	}

	/**
	 * Take a wild guess
	 * @return {Boolean} True if the like or dislike button is active
	 */
	isVideoRated() {
		if (IS_CLASSIC) {
			return this.btns.like.parentNode.parentNode.classList
				 .contains("style-default-active") ||
				 this.btns.dislike.parentNode.parentNode.classList
				 .contains("style-default-active");
		} else if (IS_GAMING) {
			return this.btns.like.classList.contains("active") ||
				 this.btns.dislike.classList.contains("active");
		}
	}

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		let subscribeButton = document.querySelector(
			'ytd-subscribe-button-renderer > paper-button, ytg-subscribe-button > paper-button'
		);
		return subscribeButton && (subscribeButton.hasAttribute('subscribed') ||
			subscribeButton.getAttribute("aria-pressed") === "true");
	}	

	/**
	 * Wait the end of the ad
	 * @return {function} callback The function to execute when the ad 
	 *     is finished
	 */
	_waitEndOfAd(callback) {
		// wait 1s to be sure that ad as load or not :
		// if not waiting, js may be faster than ad loading (which is done after video loading)
		// fortunatly, true video never start auto when an ad is loading, then wait video start to
		// detect if this is an ad or true vid
	 	this.waitTimerTwo(1, () => {
			if (typeof this.video === "undefined") {
				console.error(
					"waitEndOfAd can only be used after waitForVideo or else this.video is not defined"
				);
			}
			if (this.video.closest(".ad-showing,.ad-interrupting") !== null) {
				setTimeout(() => this._waitEndOfAd(callback), 1000);
				return;
			} else {
				log("ad finished");

				// update video element to not be the ad element
				callback();
			}
		});
	}
	waitEndOfAd(callback) {
		log("Detecting ad");
		this._waitEndOfAd(callback);
		
	}

	shouldLike() {
		let rated = this.isVideoRated();
		if (rated) {
			log("Not like: already liked video");
			return false;
		}

		let mode_should_like = "";
		if (this.options.like_what === "subscribed") {
			log("Sub mode");
			mode_should_like = this.isUserSubscribed();	
		} else { // it all mode
			log("All mode");
			mode_should_like = true;
		}
		
		log("Use list:", this.options.use_list);
		if (this.options.use_list) {
			let list_should_like = "";
			let creator = getCreatorFromVideo();
			let creator_list = this.options.creator_list;
			let in_list = false;
			for (var i = 0; i < creator_list.length; i++) {
				if ( creator_list[i].URL === creator.URL ) {
					log("Creator is in list");
					in_list = true;
					break;
				}
			}

			if (this.options.type_list === "white") {
				log("List is in white mode")
				list_should_like = in_list;
				// in white list only the list matter
				let should_like = list_should_like;
				log(`Should like: ${should_like}`);
				return should_like;
			} else if (this.options.type_list === "black") {
				log("List is in black mode")
				list_should_like = !in_list;

				let should_like = list_should_like && mode_should_like;
				log(`Should like: ${should_like}`);
				return should_like;
			} else {
				console.error("Unknow list type for liker")
			}
		} else {
			log(`Should like: ${mode_should_like}`)
			return mode_should_like;
		}
	}

	/*
	 * Clickity click the button
	 */
	attemptLike() {
		this.btns.like.click();
	}

	/*
	 * Clickity click the skip button
	 */
/*	attemptSkip() {
		this.btns.skip.click();
	}*/

	/**
	 * Prevent multiple run if the listen event is triggered multiples times
	 */
	blockMultipleRun() {
		//if not defined this is the 1st run
		if (!this.hasOwnProperty("IS_STARTED")) { 
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

	/**
	 * Free the block to reset the multipleRun
	 */
	finish() {
		this.IS_STARTED = false;
	}

	/**
	 * Starts the liking.
	 * The liker won't do anything unless this method is called.
	 */
	async init() {
		if (this.options.like_what === "none") {
			log("yt-autolike disabled")
			return;
		}

		this.blockMultipleRun();
		this.reset()
		log('yt-autolike start')
		// this.skipAd(() => {
		// 	if(this.isAdPlaying) {
		// 		document.getElementsByClassName('videoAdUiSkipButton')[0].click;
		// 	}
		// });
		await this.update_options();
		this.waitForVideo(() => {
			this.waitForButtons(() => {
				/*
				If the video is already liked/disliked
				or the user isn't subscribed to this channel,
				then we don't need to do anything.
				 */
				if ( !this.shouldLike() ) {
					log("not liked check 1");
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
				
				this.waitEndOfAd(() => {
					this.waitTimer(() => {
						/*
						Maybe the use did an action while we was waiting, so check again
						*/
						if ( !this.shouldLike() ) {
							log("not liked check 2");
							this.finish();
							return;
						}
						this.attemptLike();
						log('liked');
						this.options.counter += 1;
						optionManager.set(this.options).then(() => {
							this.finish();							
						});
					});
				});
			});
		});
	}
}
