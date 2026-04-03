export function isButtonPressed(button) {
  return button?.getAttribute('aria-pressed') === 'true';
}

export function isVideoRated({ likeButton, dislikeButton }) {
  if (!likeButton || !dislikeButton) {
    return false;
  }

  return (
    (likeButton.classList.contains('style-default-active') &&
      !likeButton.classList.contains('size-default')) ||
    dislikeButton.classList.contains('style-default-active') ||
    isButtonPressed(likeButton) ||
    isButtonPressed(dislikeButton)
  );
}

export function isSubscribed(subscribeButton) {
  if (!subscribeButton) {
    return false;
  }

  return (
    subscribeButton.hasAttribute('subscribed') ||
    subscribeButton.classList.contains('yt-spec-button-shape-next--tonal')
  );
}

export function shouldLikeByMinutes(video, minutes) {
  if (!video || Number.isNaN(minutes)) {
    return false;
  }

  return (
    video.currentTime >= minutes * 60 ||
    (Number.isFinite(video.duration) && video.currentTime >= video.duration)
  );
}

export function shouldLikeByPercent(video, percent) {
  if (!video || Number.isNaN(percent) || !video.duration) {
    return false;
  }

  return video.currentTime / video.duration >= percent;
}
