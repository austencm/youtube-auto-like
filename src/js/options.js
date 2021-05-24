import I18n from './utils/i18n';
import OptionManager from './utils/option-manager';

const defaults = {
  like_what: 'subscribed',
  like_when: 'instantly',
  like_when_minutes: '2',
  like_when_percent: '50',
  disabled: false,
};
const optionManager = new OptionManager(defaults);
const i18n = new I18n();
const bugReportTemplate = `
<!-- Thanks for reporting! A debug log is already attached. If you have any other info that might be helpful, please write above the line. -->



__________________________
### Log
`;

i18n.populateText();

const loadOptions = async () => {
  const options = await optionManager.get();

  document.querySelectorAll('input').forEach((field) => {
    if (!options.hasOwnProperty(field.name)) return;

    const val = options[field.name];

    if (field.type === 'radio' || field.type === 'checkbox') {
      field.checked = field.value === val;
    } else {
      field.value = val;
    }
  });

  chrome.storage.sync.get({ log: '[no log found]' }, ({ log }) => {
    // Add options state to report issue link
    const reportLink = document.querySelector('#report-link');
    const url = `https://github.com/austencm/youtube-auto-like/issues/new?labels=bug&body=${encodeURIComponent(
      bugReportTemplate + log,
    )}`;
    reportLink.setAttribute('href', url);
  });
};

async function handleOptionsChange(e) {
  const newOptions = {};
  // Extract form data
  Array.from(new FormData(e.currentTarget).entries()).forEach(
    ([name, val]) => (newOptions[name] = val),
  );

  setStatus('saving...');
  await optionManager.set(newOptions);
  await loadOptions();
  setTimeout(() => setStatus('saved'), 300);
}

function setStatus(status = '') {
  document.querySelector('.status').innerText = status;
}

loadOptions();

// When the user changes an option, save it
document.querySelector('#options-form').addEventListener('change', handleOptionsChange);

// Check for saved update info
async function checkForSavedRelease() {
  chrome.storage.local.get('latestRelease', ({ latestRelease }) => {
    if (latestRelease) {
      const updateNotice = document.querySelector('.update-notice');

      updateNotice.innerHTML = `
        <p>Hey! There's a newer version of the extension available.</p>
        <div>
          <a class="button button--primary" href="${latestRelease.downloadUrl}">Download v${latestRelease.version}</a>
          <a class="button" href="https://github.com/austencm/youtube-auto-like/releases" target="_blank" rel="noreferrer">See releases</a>
        </div>
      `;

      updateNotice.removeAttribute('hidden');
    }
  });
}

checkForSavedRelease();
