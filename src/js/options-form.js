import { defaultOptions } from './config/defaults';

export const optionFieldLimits = {
  like_when_minutes: {
    min: 0,
    max: 100,
    step: 0.5,
    fallback: defaultOptions.like_when_minutes,
  },
  like_when_percent: {
    min: 0,
    max: 100,
    step: 5,
    fallback: defaultOptions.like_when_percent,
  },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeNumericOption(fieldName, rawValue) {
  const limits = optionFieldLimits[fieldName];

  if (!limits) {
    return rawValue;
  }

  const parsedValue = Number.parseFloat(String(rawValue).replace(',', '.'));

  if (Number.isNaN(parsedValue)) {
    return limits.fallback;
  }

  const normalizedValue = clamp(parsedValue, limits.min, limits.max);

  if (limits.step >= 1) {
    return String(Math.round(normalizedValue));
  }

  return String(Number(normalizedValue.toFixed(1)));
}

export function normalizeOptionsFormValues(options) {
  return {
    ...options,
    like_when_minutes: normalizeNumericOption(
      'like_when_minutes',
      options.like_when_minutes
    ),
    like_when_percent: normalizeNumericOption(
      'like_when_percent',
      options.like_when_percent
    ),
  };
}
