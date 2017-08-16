/**
 * Likes YouTube videos.
 * For the newer material design layout
 */
class MaterialLiker {
  /**
   * @param {Object} options Must have the option 'like_what', indicating
   *                         whether to like all videos or just subscribed
   */
  constructor(options) {
    this.options = options
    this.iconSvgData = {
      like: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z',
      dislike: 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z'
    }
  }

  /**
   * Clears data for another round of slick liking action
   */
  reset() {
    this.btns = {}
  }

  /**
   * Detects when like/dislike buttons have loaded (so we can press them)
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  waitForButtons(callback) {
    // console.log('checking buttons...')

		// Select the like/dislike icons using their SVG data
		let iconLike = document.querySelector(`#menu.ytd-video-primary-info-renderer g path[d="${this.iconSvgData.like}"]`)
		let iconDislike = document.querySelector(`#menu.ytd-video-primary-info-renderer g path[d="${this.iconSvgData.dislike}"]`)

    // Make sure both icons exist
		if (iconLike && iconDislike) {
			// Find and store closest buttons
			this.btns.like = iconLike.closest('button')
			this.btns.dislike = iconDislike.closest('button')
			callback()
		}
    // Otherwise wait a second and try again
    else {
			setTimeout(() => this.waitForButtons(callback), 1000 )
		}
  }

  /**
   * Take a wild guess
   * @return {Boolean} True if the like or dislike button is active
   */
  isVideoRated() {
      return this.btns.like.classList.contains('style-default-active') ||
             this.btns.dislike.classList.contains('style-default-active')
  }

  /**
   * Another tough one
   * @return {Boolean} True if the user is subscribed to
   *                   the current video's channel
   */
  isUserSubscribed() {
      // Check if the subscribtion button is active
      let subscribeButton = document.querySelector('#subscribe-button paper-button')
      return subscribeButton && subscribeButton.hasAttribute('subscribed')
  }

  /**
   * Clickity click the button
   */
  attemptLike() {
    // console.log('attempting like...')

    this.btns.like.click()
  }

  /**
   * Starts the liking magic.
   * The liker won't do anything unless this method is called.
   */
  init() {
    // console.log('initializing...')

    this.reset()
    this.waitForButtons(() => {
      /*
      If the video is already liked/disliked
      or the user isn't subscribed to this channel,
      then we don't need to do anything.
       */
			if ( this.isVideoRated() || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) ) {
          return
      }
      this.attemptLike()
    })
  }
}
