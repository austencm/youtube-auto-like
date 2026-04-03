import { describe, expect, it } from 'vitest';
import {
  getLatestReleaseInfo,
  normalizeVersion,
  shouldNotifyAboutUpdate,
} from './check-updates';

describe('check update helpers', () => {
  it('normalizes versions with a leading v', () => {
    expect(normalizeVersion('v2.8.1')).toBe('2.8.1');
    expect(normalizeVersion(' 2.8.1 ')).toBe('2.8.1');
    expect(normalizeVersion()).toBe('');
  });

  it('extracts latest release info only when required fields exist', () => {
    expect(
      getLatestReleaseInfo({
        tag_name: 'v3.0.0',
        assets: [{ browser_download_url: 'https://example.com/release.zip' }],
      })
    ).toEqual({
      version: '3.0.0',
      downloadUrl: 'https://example.com/release.zip',
    });

    expect(getLatestReleaseInfo({ tag_name: 'v3.0.0', assets: [] })).toBe(null);
    expect(getLatestReleaseInfo({})).toBe(null);
  });

  it('only notifies when a valid newer release differs from current version', () => {
    const latestRelease = {
      version: '3.0.0',
      downloadUrl: 'https://example.com/release.zip',
    };

    expect(shouldNotifyAboutUpdate('v2.8.1', latestRelease)).toBe(true);
    expect(shouldNotifyAboutUpdate('3.0.0', latestRelease)).toBe(false);
    expect(shouldNotifyAboutUpdate('3.0.0', null)).toBe(false);
  });
});
