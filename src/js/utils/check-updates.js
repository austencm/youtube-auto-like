const RELEASE_URL =
  'https://api.github.com/repos/austencm/youtube-auto-like/releases/latest';
const REQUEST_TIMEOUT_MS = 5000;

export function normalizeVersion(version = '') {
  return String(version).replace(/^v/i, '').trim();
}

export function getLatestReleaseInfo(release) {
  const version = normalizeVersion(release?.tag_name);
  const downloadUrl = release?.assets?.[0]?.browser_download_url;

  if (!version || !downloadUrl) {
    return null;
  }

  return {
    version,
    downloadUrl,
  };
}

export function shouldNotifyAboutUpdate(currentVersion, latestRelease) {
  if (!latestRelease) {
    return false;
  }

  return normalizeVersion(currentVersion) !== latestRelease.version;
}

async function fetchLatestRelease(fetchImpl = fetch) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchImpl(RELEASE_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error(`update check failed with status ${response.status}`);
    }

    const release = await response.json();

    return getLatestReleaseInfo(release);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function clearUpdateNotice() {
  await chrome.action.setBadgeText({ text: '' });
  await chrome.storage.local.remove('latestRelease');
}

async function saveUpdateNotice(latestRelease) {
  await chrome.action.setBadgeText({ text: '1' });
  await chrome.storage.local.set({ latestRelease });
}

export async function checkForUpdates(fetchImpl = fetch) {
  const version = chrome.runtime.getManifest().version;

  try {
    const latestRelease = await fetchLatestRelease(fetchImpl);

    if (!latestRelease) {
      return clearUpdateNotice();
    }

    if (shouldNotifyAboutUpdate(version, latestRelease)) {
      return saveUpdateNotice(latestRelease);
    }

    return clearUpdateNotice();
  } catch (error) {
    console.warn('[youtube-auto-like] update check failed', error);
    return clearUpdateNotice();
  }
}

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onStartup.addListener(() => checkForUpdates());
  chrome.runtime.onInstalled.addListener(() => checkForUpdates());
}
