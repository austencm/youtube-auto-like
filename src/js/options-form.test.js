import { describe, expect, it } from 'vitest';
import {
  normalizeNumericOption,
  normalizeOptionsFormValues,
} from './options-form';

describe('options form helpers', () => {
  it('clamps minute values to the supported range', () => {
    expect(normalizeNumericOption('like_when_minutes', '2.5')).toBe('2.5');
    expect(normalizeNumericOption('like_when_minutes', '-1')).toBe('0');
    expect(normalizeNumericOption('like_when_minutes', '101')).toBe('100');
    expect(normalizeNumericOption('like_when_minutes', 'abc')).toBe('2');
  });

  it('clamps percent values and rounds to whole-step values', () => {
    expect(normalizeNumericOption('like_when_percent', '55')).toBe('55');
    expect(normalizeNumericOption('like_when_percent', '-5')).toBe('0');
    expect(normalizeNumericOption('like_when_percent', '150')).toBe('100');
    expect(normalizeNumericOption('like_when_percent', 'foo')).toBe('50');
  });

  it('normalizes both numeric option fields together', () => {
    expect(
      normalizeOptionsFormValues({
        like_what: 'all',
        like_when: 'percent',
        like_when_minutes: '1,5',
        like_when_percent: '105',
        disabled: false,
      })
    ).toEqual({
      like_what: 'all',
      like_when: 'percent',
      like_when_minutes: '1.5',
      like_when_percent: '100',
      disabled: false,
    });
  });
});
