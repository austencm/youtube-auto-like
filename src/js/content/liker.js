const selectors = {
  likeButton: [
    '#top-level-buttons-computed > ytd-toggle-button-renderer:nth-child(1) yt-icon-button',
    '#top-level-buttons-computed > ytd-toggle-button-renderer:nth-child(1) button',
    '#segmented-like-button button',
    'like-button-view-model button',
  ],
  dislikeButton: [
    '#top-level-buttons-computed > ytd-toggle-button-renderer:nth-child(2) yt-icon-button',
    '#top-level-buttons-computed > ytd-toggle-button-renderer:nth-child(2) button',
    '#segmented-dislike-button button',
    'dislike-button-view-model button',
  ],
  subscribeButton: [
    '#subscribe-button tp-yt-paper-button',
    '#subscribe-button button',
  ],
};

/**
 * Likes YouTube videos
 */
export default class Liker {
  /**
   * @param {Object} options
   */
  constructor({ options, log }) {
    this.options = options;
    this.status = 'idle';
    this.log = log ? log : () => {};
    this.cache = {};
    this.start = this.start.bind(this);

    // Bail if we don't need to do anything
    // DEPRECATION: options.like_what = 'none' removed in 2.0.2. Replaced with options.disabled
    if (this.options.disabled || this.options.like_what === 'none') {
      this.log('liker is disabled');
      return this.pause();
    }

    /*
    We're hooking into YouTube's custom events to determine when the page changes.
     */
    document
      .querySelector('ytd-app')
      .addEventListener('yt-page-data-updated', this.start);

    this.start();
  }

  /**
   * Just helpful for debugging at the moment
   */
  pause() {
    this.log('status: idle');
    this.status = 'idle';

    if (typeof this.onPause === 'function') {
      this.onPause();
    }
  }

  /**
   * Clears data for another round of slick liking action
   */
  reset() {
    this.cache = {};
  }

  /**
   * Detects when like/dislike buttons have loaded (so we can press them)
   */
  waitForButtons() {
    this.log('waiting for buttons...');

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const likeButton = document.querySelectorAll(selectors.likeButton)[0];
        const dislikeButton = document.querySelectorAll(
          selectors.dislikeButton
        )[0];
        // Make sure both buttons exist
        if (likeButton && dislikeButton) {
          // Store buttons
          this.cache.likeButton = likeButton;
          this.cache.dislikeButton = dislikeButton;

          this.log('...buttons ready');
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  /**
   * Detects when the video player has loaded
   */
  waitForVideo() {
    this.log('waiting for video...');

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        this.cache.video = document.querySelector('.video-stream');
        // Does the video exist?
        if (this.cache.video) {
          this.log('...video ready');
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  /**
   * @return {Boolean} True if the like or dislike button is active
   */
  isVideoRated() {
    return (
      (this.cache.likeButton.classList.contains('style-default-active') &&
        !this.cache.likeButton.classList.contains('size-default')) ||
      this.cache.dislikeButton.classList.contains('style-default-active') ||
      this.cache.likeButton.getAttribute('aria-pressed') === 'true' ||
      this.cache.dislikeButton.getAttribute('aria-pressed') === 'true'
    );
  }

  /**
   * @return {Boolean} True if the user is subscribed to
   *                   the current video's channel
   */
  isUserSubscribed() {
    // Select the sub button
    const subscribeButton =
      this.cache.subscribeButton ||
      document.querySelectorAll(selectors.subscribeButton)[0];

    // Does the button exist?
    if (!subscribeButton) {
      this.log('no subscribe button found');
      return false;
    }

    this.cache.subscribeButton = subscribeButton;

    // Is the button active?
    if (
      subscribeButton.hasAttribute('subscribed') ||
      subscribeButton.classList.contains('yt-spec-button-shape-next--tonal')
    ) {
      return true;
    }
    // If not, let's restart the Liker when the user subscribes
    else if (this.options.like_what === 'subscribed') {
      const onSubscribe = (event) => {
        this.log('user subscribed');
        // Only fire once
        event.target.removeEventListener(event.type, onSubscribe);

        if (this.status === 'idle') {
          this.start();
        }
      };

      subscribeButton.addEventListener('click', onSubscribe);
    }

    return false;
  }

  isAdPlaying() {
    return (
      this.cache.video &&
      ['ad-showing', 'ad-interrupting'].every((c) => {
        return this.cache.video
          .closest('.html5-video-player')
          .classList.contains(c);
      })
    );
  }

  /**
   * Make sure we can & should like the video,
   * then clickity click the button
   */
  async clickLike() {
    await this.waitForButtons();
    /*
    If the video is already liked/disliked
    or the user isn't subscribed to this channel,
    then we don't need to do anything.
     */
    if (this.isVideoRated()) {
      this.log('video already rated');
      return this.pause();
    }
    if (this.options.like_what === 'subscribed' && !this.isUserSubscribed()) {
      this.log('user not subscribed');
      return this.pause();
    }

    this.cache.likeButton.click();
    this.log('like button clicked');
    this.pause();
  }

  /**
   * Starts the liking magic.
   * The liker won't do anything unless this method is called.
   */
  async start() {
    this.log('status: running');
    this.status = 'running';
    this.cache = {};

    switch (this.options.like_when) {
      case 'timed': {
        const minutes = parseFloat(this.options.like_when_minutes);
        await this.waitForVideo();
        const { video } = this.cache;
        const onVideoTimeUpdate = (e) => {
          if (this.isAdPlaying()) return;
          // Are we more than the chosen mins in or at the end of the video?
          if (
            video.currentTime >= minutes * 60 ||
            video.currentTime >= video.duration
          ) {
            this.clickLike();
            video.removeEventListener('timeupdate', onVideoTimeUpdate);
          }
        };
        video.addEventListener('timeupdate', onVideoTimeUpdate);
        break;
      }

      case 'percent': {
        const percent = parseFloat(this.options.like_when_percent) / 100;
        await this.waitForVideo();
        const { video } = this.cache;
        const onVideoTimeUpdate = (e) => {
          if (this.isAdPlaying()) return;
          // Are we more than the chosen percent through the video?
          if (video.currentTime / video.duration >= percent) {
            this.clickLike();
            video.removeEventListener('timeupdate', onVideoTimeUpdate);
          }
        };
        video.addEventListener('timeupdate', onVideoTimeUpdate);
        break;
      }

      default:
        this.clickLike();
    }
  }
}
