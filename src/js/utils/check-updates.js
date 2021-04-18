async function checkForUpdates() {
  const version = chrome.runtime.getManifest().version;
  const response = await fetch('https://api.github.com/repos/austencm/youtube-auto-like/releases/latest');
  const lastestRelease = await response.json();
  const latestVersion = lastestRelease.tag_name.replace('v', '');

  if (version !== latestVersion) {
    chrome.action.setBadgeText({ text: '1' });
    chrome.storage.local.set({
      latestRelease: {
        version: latestVersion,
        downloadUrl: lastestRelease.assets[0].browser_download_url,
      },
    });
  } else {
    chrome.action.setBadgeText({ text: '' });
    chrome.storage.local.remove('latestRelease');
  }
}

chrome.runtime.onStartup.addListener(checkForUpdates);
chrome.runtime.onInstalled.addListener(checkForUpdates);