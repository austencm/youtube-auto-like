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

	getActionsElements() {
		let tests = [
			document.querySelector("#menu-container"),
			document.querySelector("#actions #top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer"),
		]
		for (var elem of tests) {
			if (trueIsVisible(elem)) {
				log("ActionsElements found.")
				return elem
			}
		}
		
		log("No visible ActionsElements found.")
		return;
	}

	/**
	 * Search the svg that has .style-scope.yt-icon (which is the svg used in yt-app)
	 * @param {string} id The id of the svg to query
	 */
	getUsedSVG(id) {
		var likeSvgRawList = document.querySelectorAll(`g#${id} path`);

		let svgs = null;
		let p = null;
		for (let item of likeSvgRawList) {
			p = item.getAttribute("d");
			svgs = document.querySelectorAll(`path[d="${p}"]`);
			for (let i of svgs) {
				if (i.matches(".style-scope.yt-icon")) return p;
			}
		}
		log("No active svg found.");
		return null;
	}

	getUsedLikeSVG() {
		return this.getUsedSVG("like");
	}

	getUsedDislikeSVG() {
		return this.getUsedSVG("dislike");
	}

	getUsedLikeFilledSVG() {
		return this.getUsedSVG("like-filled");
	}

	getUsedDislikeFilledSVG() {
		return this.getUsedSVG("dislike-filled");
	}

	getLikeDislikeElements(likePath, dislikePath) {
		let likeElement, dislikeElement;
		let actionsElements = this.getActionsElements();
		
		likeElement = actionsElements.querySelector(`g.yt-icon path[d="${likePath}"], g.iron-icon path[d="${likePath}"]`);
		dislikeElement = actionsElements.querySelector(`g.yt-icon path[d="${dislikePath}"], g.iron-icon path[d="${dislikePath}"]`);

		return [likeElement, dislikeElement];
	}

	getButtons() {
		let _;
		let [likeElement, dislikeElement] = this.getLikeDislikeElements(this.getUsedLikeSVG(), this.getUsedDislikeSVG());

		// if a button is not found, maybe it is due to svg-filled (and the video is liked)
		if (likeElement === null) {
			[likeElement, _] = this.getLikeDislikeElements(this.getUsedLikeFilledSVG(), this.getUsedDislikeSVG());
		}
		if (dislikeElement === null) {
			[_, dislikeElement] = this.getLikeDislikeElements(this.getUsedLikeSVG(), this.getUsedDislikeFilledSVG())
		}
		
		// Make sure both icons exist
		if (likeElement && dislikeElement) {
			// Find and store closest buttons
			log("got buttons");
			let btnLike = likeElement
				.closest('yt-icon-button, paper-icon-button');
			let btnDislike = dislikeElement
				.closest('yt-icon-button, paper-icon-button');

			return [btnLike, btnDislike];
				;
		} else {
			log ("did not get buttons");
			return [null, null];
		}
	}

	updateButtons() {
		[this.btns.like, this.btns.dislike] = this.getButtons();

	}

	isNewLayout() {
		return this.getUsedLikeFilledSVG() === null;
	}

	/**
	 * Detects when like/dislike buttons have loaded (so we can press them)
	 * and register element in the attributes
	 * @param {function} callback The function to execute after the buttons
	 *     have loaded
	 */
	waitForButtons(callback) {
		// wait button box load
		let box = this.getActionsElements();

		if (!box) {
			log("wait 1s for box");
			setTimeout(() => this.waitForButtons(callback), 1000 );
		} else {
			this.updateButtons();
			callback();
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
			log("Get Video.")
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
		else if (this.video.closest(".ad-showing,.ad-interrupting") !== null) {
			setTimeout(() => this.waitTimer(callback), 1000 );
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
		log("checking if video is rated");
		if (IS_CLASSIC) {
			return this.btns.like.parentNode.parentNode.classList
			    .contains("style-default-active") ||
				this.btns.dislike.parentNode.parentNode.classList
				.contains("style-default-active");
			
		} else if (IS_GAMING) {
			return this.btns.like.classList.contains("active") ||
				 this.btns.dislike.classList.contains("active");
		} else {
			throw "Unknow youtube type";
		}
	}

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		let subscribeButton = document.querySelector(
			'ytd-subscribe-button-renderer > paper-button, ytg-subscribe-button > paper-button, ytd-subscribe-button-renderer > .ytd-subscribe-button-renderer'
		);
		return subscribeButton && (subscribeButton.hasAttribute('subscribed') ||
			subscribeButton.getAttribute("aria-pressed") === "true");
	}	

	shouldLike() {
		this.updateButtons();
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
				throw "Multiple run";
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

		function isVideo() {
			return window.location.href.indexOf("watch") > -1
		}
		if (!isVideo()) {
			log("not a video");
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
	}
}


/**
 * ==============================================================
 * ==============================================================
 * ==============================================================
*/
/**
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 *
 * Description: Checks if a DOM element is truly visible.
 * Package URL: https://github.com/UseAllFive/true-visibility
 * MIT License
 */
function trueIsVisible(el, t, r, b, l, w, h) {

    'use strict';

    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param (el)      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {
        var p = el.parentNode,
                VISIBLE_PADDING = 2;

        if ( !_elementInDocument(el) ) {
            return false;
        }

        //-- Return true for document node
        if ( 9 === p.nodeType ) {
            return true;
        }

        //-- Return false if our element is invisible
        if (
             '0' === _getStyle(el, 'opacity') ||
             'none' === _getStyle(el, 'display') ||
             'hidden' === _getStyle(el, 'visibility')
        ) {
            return false;
        }

        if (
            'undefined' === typeof(t) ||
            'undefined' === typeof(r) ||
            'undefined' === typeof(b) ||
            'undefined' === typeof(l) ||
            'undefined' === typeof(w) ||
            'undefined' === typeof(h)
        ) {
            t = el.offsetTop;
            l = el.offsetLeft;
            b = t + el.offsetHeight;
            r = l + el.offsetWidth;
            w = el.offsetWidth;
            h = el.offsetHeight;
        }
        //-- If we have a parent, let's continue:
        if ( p ) {
            //-- Check if the parent can hide its children.
            if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) ) {
                //-- Only check if the offset is different for the parent
                if (
                    //-- If the target element is to the right of the parent elm
                    l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
                    //-- If the target element is to the left of the parent elm
                    l + w - VISIBLE_PADDING < p.scrollLeft ||
                    //-- If the target element is under the parent elm
                    t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
                    //-- If the target element is above the parent elm
                    t + h - VISIBLE_PADDING < p.scrollTop
                ) {
                    //-- Our target element is out of bounds:
                    return false;
                }
            }
            //-- Add the offset parent's left/top coords to our element's offset:
            if ( el.offsetParent === p ) {
                l += p.offsetLeft;
                t += p.offsetTop;
            }
            //-- Let's recursively check upwards:
            return _isVisible(p, t, r, b, l, w, h);
        }
        return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
        if ( window.getComputedStyle ) {
            return document.defaultView.getComputedStyle(el,null)[property];
        }
        if ( el.currentStyle ) {
            return el.currentStyle[property];
        }
    }

    function _elementInDocument(element) {
        while (element = element.parentNode) {
            if (element == document) {
                    return true;
            }
        }
        return false;
    }

    return _isVisible(el, t, r, b, l, w, h);

};