import {
  isSubscribed,
  isVideoRated,
  shouldLikeByMinutes,
  shouldLikeByPercent,
} from './rules';

const WAIT_TIMEOUT_MS = 15000;
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
    this.runToken = 0;
    this.cleanups = [];

    this.start = this.start.bind(this);
    this.handlePageUpdate = this.handlePageUpdate.bind(this);

    // Bail if we don't need to do anything
    // DEPRECATION: options.like_what = 'none' removed in 2.0.2. Replaced with options.disabled
    if (this.options.disabled || this.options.like_what === 'none') {
      this.log('liker is disabled');
      return this.pause();
    }

    const appRoot = document.querySelector('ytd-app');

    if (appRoot) {
      appRoot.addEventListener('yt-page-data-updated', this.handlePageUpdate);
    } else {
      this.log('no ytd-app root found');
    }

    this.start();
  }

  handlePageUpdate() {
    this.start();
  }

  registerCleanup(callback) {
    this.cleanups.push(callback);

    return () => {
      this.cleanups = this.cleanups.filter((cleanup) => cleanup !== callback);
    };
  }

  cleanupRun() {
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
    this.cache = {};
  }

  /**
   * Just helpful for debugging at the moment
   */
  pause() {
    this.runToken += 1;
    this.cleanupRun();
    this.log('status: idle');
    this.status = 'idle';

    if (typeof this.onPause === 'function') {
      this.onPause();
    }
  }

  getActiveRunToken() {
    this.runToken += 1;
    this.cleanupRun();

    return this.runToken;
  }

  isActiveRun(runToken) {
    return this.status === 'running' && this.runToken === runToken;
  }

  isWatchPage() {
    return window.location.pathname === '/watch';
  }

  queryFirst(selectorList) {
    return selectorList
      .map((selector) => document.querySelector(selector))
      .find(Boolean);
  }

  async waitForValue(getValue, { label, runToken, timeoutMs = WAIT_TIMEOUT_MS }) {
    this.log(`waiting for ${label}...`);

    return new Promise((resolve) => {
      const targetNode = document.body || document.documentElement;
      let timeoutId = null;
      let observer = null;
      let unregisterCleanup = null;

      const finish = (value, message) => {
        if (observer) {
          observer.disconnect();
        }

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (unregisterCleanup) {
          unregisterCleanup();
        }

        if (message) {
          this.log(message);
        }

        resolve(value);
      };

      const check = () => {
        if (!this.isActiveRun(runToken)) {
          finish(null);
          return true;
        }

        const value = getValue();

        if (value) {
          finish(value, `...${label} ready`);
          return true;
        }

        return false;
      };

      if (check()) {
        return;
      }

      observer = new MutationObserver(check);
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      timeoutId = setTimeout(() => {
        finish(null, `${label} not found before timeout`);
      }, timeoutMs);

      unregisterCleanup = this.registerCleanup(() => finish(null));
    });
  }

  /**
   * Detects when like/dislike buttons have loaded (so we can press them)
   */
  async waitForButtons(runToken) {
    const buttons = await this.waitForValue(
      () => {
        const likeButton = this.queryFirst(selectors.likeButton);
        const dislikeButton = this.queryFirst(selectors.dislikeButton);

        if (!likeButton || !dislikeButton) {
          return null;
        }

        return { likeButton, dislikeButton };
      },
      { label: 'buttons', runToken }
    );

    if (buttons) {
      Object.assign(this.cache, buttons);
    }

    return buttons;
  }

  /**
   * Detects when the video player has loaded
   */
  async waitForVideo(runToken) {
    const video = await this.waitForValue(
      () => document.querySelector('.video-stream'),
      { label: 'video', runToken }
    );

    if (video) {
      this.cache.video = video;
    }

    return video;
  }

  /**
   * @return {Boolean} True if the like or dislike button is active
   */
  isVideoRated() {
    return isVideoRated(this.cache);
  }

  /**
   * @return {Boolean} True if the user is subscribed to
   *                   the current video's channel
   */
  isUserSubscribed(runToken) {
    const subscribeButton =
      this.cache.subscribeButton || this.queryFirst(selectors.subscribeButton);

    if (!subscribeButton) {
      this.log('no subscribe button found');
      return false;
    }

    this.cache.subscribeButton = subscribeButton;

    if (isSubscribed(subscribeButton)) {
      return true;
    }

    if (this.options.like_what === 'subscribed') {
      const onSubscribe = () => {
        this.log('user subscribed');

        if (this.status === 'idle') {
          this.start();
        }
      };

      subscribeButton.addEventListener('click', onSubscribe, { once: true });
      this.registerCleanup(() => {
        subscribeButton.removeEventListener('click', onSubscribe);
      });
    }

    return false;
  }

  isAdPlaying() {
    if (!this.cache.video) {
      return false;
    }

    const videoPlayer = this.cache.video.closest('.html5-video-player');

    if (!videoPlayer) {
      return false;
    }

    return ['ad-showing', 'ad-interrupting'].every((className) => {
      return videoPlayer.classList.contains(className);
    });
  }

  attachTimeUpdateListener(runToken, onVideoTimeUpdate) {
    const { video } = this.cache;

    video.addEventListener('timeupdate', onVideoTimeUpdate);
    this.registerCleanup(() => {
      video.removeEventListener('timeupdate', onVideoTimeUpdate);
    });

    onVideoTimeUpdate();

    return this.isActiveRun(runToken);
  }

  /**
   * Make sure we can & should like the video,
   * then clickity click the button
   */
  async clickLike(runToken) {
    const buttons = await this.waitForButtons(runToken);

    if (!buttons || !this.isActiveRun(runToken)) {
      return;
    }

    /*
    If the video is already liked/disliked
    or the user isn't subscribed to this channel,
    then we don't need to do anything.
     */
    if (this.isVideoRated()) {
      this.log('video already rated');
      return this.pause();
    }

    if (this.options.like_what === 'subscribed' && !this.isUserSubscribed(runToken)) {
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
    const runToken = this.getActiveRunToken();

    if (!this.isWatchPage()) {
      this.log('not on a watch page');
      return this.pause();
    }

    this.log('status: running');
    this.status = 'running';

    switch (this.options.like_when) {
      case 'timed': {
        const minutes = parseFloat(this.options.like_when_minutes);
        const video = await this.waitForVideo(runToken);

        if (!video || !this.isActiveRun(runToken)) {
          return this.pause();
        }

        this.attachTimeUpdateListener(runToken, () => {
          if (this.isAdPlaying()) {
            return;
          }

          if (shouldLikeByMinutes(video, minutes)) {
            this.clickLike(runToken);
          }
        });
        break;
      }

      case 'percent': {
        const percent = parseFloat(this.options.like_when_percent) / 100;
        const video = await this.waitForVideo(runToken);

        if (!video || !this.isActiveRun(runToken)) {
          return this.pause();
        }

        this.attachTimeUpdateListener(runToken, () => {
          if (this.isAdPlaying()) {
            return;
          }

          if (shouldLikeByPercent(video, percent)) {
            this.clickLike(runToken);
          }
        });
        break;
      }

      default:
        this.clickLike(runToken);
    }
  }
}
