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
    // Select buttons if we don't already have them stored
    this.dom.like = this.dom.like || document.querySelector('.like-button-renderer-like-button-unclicked');
    this.dom.dislike = this.dom.dislike || document.querySelector('.like-button-renderer-dislike-button-unclicked');

    // Make sure both buttons exist
    if (this.dom.like && this.dom.dislike) {
      callback();
    }
    // Otherwise wait a second and try again
    else {
      setTimeout(() => this.waitForButtons(callback), 1000);
    }
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
      then we shouldn't do anything.
       */
      if (this.isVideoRated() || (this.options.like_what === 'subscribed' && !this.isUserSubscribed())) {
        return;
      }
      // console.log('attempting like...')
      this.dom.like.click();

      /*
      Confirm the click registered.
      Sometimes the buttons load before the event
      handlers get attached and nothing happens.
       */
      if (!this.isVideoRated()) {
        // Persistence pays off
        setTimeout(this.attemptLike, 1000)
      }
    });
  }

  /**
   * @return {Boolean} True if the like or dislike button is active
   */
  isVideoRated() {
    return this.dom.like.classList.contains('hid') ||
           this.dom.dislike.classList.contains('hid')
  }

  /**
   * @return {Boolean} True if the user is subscribed to
   *                   the current video's channel
   */
  isUserSubscribed() {
    // Check if the subscribtion button is active
    return document.querySelector('.yt-uix-subscription-button').classList.contains('hover-enabled')
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

    if (this.options.like_when === 'timed') {
      const video = document.querySelector('.video-stream');
      const { duration } = video;

      const onVideoTimeUpdate = () => {
        // console.log('timeupdate')
        if (video.currentTime >= 2 * 60 || video.currentTime >= duration) {
          this.attemptLike();
          video.removeEventListener('timeupdate', onVideoTimeUpdate);
        }
      }
      video.addEventListener('timeupdate', onVideoTimeUpdate);

      return;
    }

    this.attemptLike();

    // this.reset()
    // this.waitForButtons(() => {
    //   /*
    //   If the video is already liked/disliked
    //   or the user isn't subscribed to this channel,
    //   then we don't need to do anything.
    //    */
    //   if ( this.isVideoRated() || ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() ) ) {
    //     return
    //   }
    //   this.attemptLike()
    // })
  }
}
