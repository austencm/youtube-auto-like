import { describe, expect, it } from 'vitest';
import {
  isButtonPressed,
  isSubscribed,
  isVideoRated,
  shouldLikeByMinutes,
  shouldLikeByPercent,
} from './rules';

function createButton({
  ariaPressed = 'false',
  classes = [],
  subscribed = false,
} = {}) {
  return {
    classList: {
      contains: (className) => classes.includes(className),
    },
    getAttribute: (attributeName) => {
      if (attributeName === 'aria-pressed') {
        return ariaPressed;
      }

      return null;
    },
    hasAttribute: (attributeName) => {
      return attributeName === 'subscribed' ? subscribed : false;
    },
  };
}

describe('content rules', () => {
  it('detects pressed buttons via aria state', () => {
    expect(isButtonPressed(createButton({ ariaPressed: 'true' }))).toBe(true);
    expect(isButtonPressed(createButton({ ariaPressed: 'false' }))).toBe(false);
    expect(isButtonPressed(null)).toBe(false);
  });

  it('detects rated videos from like button state', () => {
    const likeButton = createButton({
      classes: ['style-default-active'],
    });
    const dislikeButton = createButton();

    expect(isVideoRated({ likeButton, dislikeButton })).toBe(true);
  });

  it('does not treat legacy size-default like buttons as active likes', () => {
    const likeButton = createButton({
      classes: ['style-default-active', 'size-default'],
    });
    const dislikeButton = createButton();

    expect(isVideoRated({ likeButton, dislikeButton })).toBe(false);
  });

  it('detects rated videos from dislike button aria state', () => {
    const likeButton = createButton();
    const dislikeButton = createButton({ ariaPressed: 'true' });

    expect(isVideoRated({ likeButton, dislikeButton })).toBe(true);
  });

  it('detects subscription from attribute or tonal class', () => {
    expect(isSubscribed(createButton({ subscribed: true }))).toBe(true);
    expect(
      isSubscribed(
        createButton({ classes: ['yt-spec-button-shape-next--tonal'] })
      )
    ).toBe(true);
    expect(isSubscribed(createButton())).toBe(false);
  });

  it('decides likes by elapsed minutes or video end', () => {
    expect(
      shouldLikeByMinutes({ currentTime: 120, duration: 500 }, 2)
    ).toBe(true);
    expect(
      shouldLikeByMinutes({ currentTime: 30, duration: 30 }, 2)
    ).toBe(true);
    expect(
      shouldLikeByMinutes({ currentTime: 30, duration: 500 }, 2)
    ).toBe(false);
  });

  it('decides likes by watched percentage', () => {
    expect(
      shouldLikeByPercent({ currentTime: 50, duration: 100 }, 0.5)
    ).toBe(true);
    expect(
      shouldLikeByPercent({ currentTime: 49, duration: 100 }, 0.5)
    ).toBe(false);
    expect(
      shouldLikeByPercent({ currentTime: 50, duration: 0 }, 0.5)
    ).toBe(false);
  });
});
