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
    this.options = options
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
    this.btns.like = document.querySelector('.like-button-renderer-like-button-unclicked')
    this.btns.dislike = document.querySelector('.like-button-renderer-dislike-button-unclicked')

    // Make sure both buttons exist
    if (this.btns.like && this.btns.dislike)
      callback()
    // Otherwise wait a second and try again
    else
      setTimeout(() => this.waitForButtons(callback), 1000 )
  }

  /**
   * Clickity click the button
   */
  attemptLike() {
      // console.log('attempting like...')

      this.btns.like.click()

      /*
      Confirm the click registered.
      Sometimes the buttons load before the event
      handlers get attached and nothing happens.
       */
      if ( !this.isVideoRated() )
        // Persistence pays off
        setTimeout(() => this.attemptLike(), 1000 )
  }

  /**
   * Take a wild guess
   * @return {Boolean} True if the like or dislike button is active
   */
  isVideoRated() {
    return this.btns.like.classList.contains('hid') ||
           this.btns.dislike.classList.contains('hid')
  }

  /**
   * Another tough one
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
