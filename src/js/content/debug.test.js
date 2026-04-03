import { describe, expect, it } from 'vitest';
import { MAX_LOG_ENTRIES, stringifyPart } from './debug';

describe('debug helpers', () => {
  it('stringifies plain values and errors safely', () => {
    expect(stringifyPart('hello')).toBe('hello');
    expect(stringifyPart({ ok: true })).toBe('{"ok":true}');

    const errorText = stringifyPart(new Error('boom'));
    expect(errorText).toContain('Error');
    expect(errorText).toContain('boom');
  });

  it('keeps a bounded log buffer size', () => {
    const messages = Array.from({ length: MAX_LOG_ENTRIES + 10 }, (_, index) => {
      return `[entry ${index}]`;
    });

    const bounded = messages.slice(-MAX_LOG_ENTRIES);

    expect(bounded).toHaveLength(MAX_LOG_ENTRIES);
    expect(bounded[0]).toBe('[entry 10]');
    expect(bounded.at(-1)).toBe(`[entry ${MAX_LOG_ENTRIES + 9}]`);
  });
});
