/**
 * Likes YouTube videos.
 * For the newer material design layout
 */
export default class MaterialLiker {
  /**
   * @param {Object} options
   */
  constructor(options) {
    this.options = options;
    this.iconSvgData = {
      like: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z',
      dislike: 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z'
    };

    this.init = this.init.bind(this);
    this.reset = this.reset.bind(this);
    this.attemptLike = this.attemptLike.bind(this);
  }

  /**
   * Clears data for another round of slick liking action
   */
  reset() {
    this.dom = {};
  }

  /**
   * Detects when like/dislike buttons have loaded (so we can press them)
   * @param  {Function} callback
   */
  waitForButtons(callback) {
    // console.log('checking buttons...')

		// Select the like/dislike icons using their SVG data
		const iconLike = document.querySelector(`g path[d="${this.iconSvgData.like}"]`);
		const iconDislike = document.querySelector(`g path[d="${this.iconSvgData.dislike}"]`);

    // Make sure both icons exist
		if (iconLike && iconDislike) {
			// Find and store closest buttons
      // YouTube gaming uses a different button type
			this.dom.like = iconLike.closest('yt-icon-button, paper-icon-button');
			this.dom.dislike = iconDislike.closest('yt-icon-button, paper-icon-button');
      callback();
		}
    // Otherwise wait a second and try again
    else {
      setTimeout(() => this.waitForButtons(callback), 1000);
    }
  }

  /**
   * Detects when the video player has loaded
   * @param  {Function} callback
   */
  waitForVideo(callback) {
    // console.log('checking video...')
    this.video = document.querySelector('.video-stream');
    // Does the video exist?
    if (this.video) {
      callback();
		}
    // Otherwise wait a second and try again
    else {
      setTimeout(() => this.waitForVideo(callback), 1000);
    }
  }

  /**
   * @return {Boolean} True if the like or dislike button is active
   */
  isVideoRated() {
    // console.log('isVideoRated?')
    return (this.dom.like.classList.contains('style-default-active') && !this.dom.like.classList.contains('size-default')) ||
           this.dom.dislike.classList.contains('style-default-active');
  }

  /**
   * @return {Boolean} True if the user is subscribed to
   *                   the current video's channel
   */
  isUserSubscribed() {
    // console.log('isUserSubbed?')
    // Select the sub button
    const subButton = this.dom.sub || document.querySelector('ytd-watch-flexy ytd-subscribe-button-renderer > paper-button, ytg-subscribe-button .subscribed');;
    // Does the button exist?
    if (!subButton) return false;
    // Is the button active?
    if (subButton.hasAttribute('subscribed') || subButton.classList.contains('subscribed')) {
      this.dom.sub = subButton;
      return true;
    }
    // TODO: If not, let's reinitialize the Liker if the user subscribes
    // else if (this.options.like_what === 'subscribed') {
    //   subButton.addEventListener('click', e => {
    //     // console.log('subButton click')
    //     e.target.removeEventListener(e.type, arguments.callee);
    //     this.init();
    //   });
    // }
    return false;
  }

  isAdPlaying() {
    return this.video && ['ad-showing', 'ad-interrupting'].every(c => {
      return this.video.closest('.html5-video-player').classList.contains(c);
    });
  }

  /**
   * Make sure we can & should like the video,
   * then clickity click the button
   */
  attemptLike() {
    this.waitForButtons(() => {
      /*
      If the video is already liked/disliked
      or the user isn't subscribed to this channel,
      then we don't need to do anything.
       */
      if (this.isVideoRated() || (this.options.like_what === 'subscribed' && !this.isUserSubscribed())) {
        return;
      }

      // console.log('attempting like...')

      this.dom.like.click();
    });
  }

  /**
   * Starts the liking magic.
   * The liker won't do anything unless this method is called.
   */
  init() {
    // console.log('initializing...')

    // Bail if we don't need to do anything
    // DEPRECATION: options.like_what = 'none' removed in 2.0.2. Replaced with options.disabled
    if (this.options.disabled || this.options.like_what === 'none') {
      return;
    }

    this.reset();

    switch (this.options.like_when) {
      case 'timed':
        return this.waitForVideo(() => {
          const { video } = this;
          const onVideoTimeUpdate = e => {
            if (this.isAdPlaying()) return;
            // Are we 2 mins in or at the end of the video?
            if (video.currentTime >= 2 * 60 || video.currentTime >= video.duration) {
              this.attemptLike();
              video.removeEventListener('timeupdate', onVideoTimeUpdate);
            }
          }
          video.addEventListener('timeupdate', onVideoTimeUpdate);
        });

      case 'percent':
        return this.waitForVideo(() => {
          const { video } = this;

          const onVideoTimeUpdate = e => {
            if (this.isAdPlaying()) return;
            // Are we more than 50% through the video?
            if (video.currentTime / video.duration >= 0.5) {
              this.attemptLike();
              video.removeEventListener('timeupdate', onVideoTimeUpdate);
            }
          }
          video.addEventListener('timeupdate', onVideoTimeUpdate);
        });

      default:
        return this.attemptLike();
    }
  }
}
