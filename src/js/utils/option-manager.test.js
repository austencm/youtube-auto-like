import { describe, expect, it } from 'vitest';
import { defaultOptions } from '../config/defaults';
import OptionManager from './option-manager';

describe('OptionManager normalize', () => {
  it('merges defaults and preserves string-based numeric fields', () => {
    const optionManager = new OptionManager(defaultOptions);

    expect(
      optionManager.normalize({
        like_what: 'all',
        like_when_minutes: 3,
      })
    ).toEqual({
      like_what: 'all',
      like_when: 'instantly',
      like_when_minutes: '3',
      like_when_percent: '50',
      disabled: false,
    });
  });

  it('normalizes disabled to a boolean', () => {
    const optionManager = new OptionManager(defaultOptions);

    expect(optionManager.normalize({ disabled: true }).disabled).toBe(true);
    expect(optionManager.normalize({ disabled: 'yes' }).disabled).toBe(false);
    expect(optionManager.normalize({ disabled: false }).disabled).toBe(false);
  });
});
