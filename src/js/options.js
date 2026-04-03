import { defaultOptions } from './config/defaults';
import { LOG_STORAGE_KEY } from './content/debug';
import I18n from './utils/i18n';
import {
  normalizeNumericOption,
  normalizeOptionsFormValues,
} from './options-form';
import OptionManager from './utils/option-manager';

const optionManager = new OptionManager(defaultOptions);
const i18n = new I18n();
const form = document.querySelector('#options-form');
const bugReportTemplate = `
<!-- Thanks for reporting! A debug log is already attached. If you have any other info that might be helpful, please write above the line. -->



__________________________
### Log
`;

i18n.populateText();

function serializeOptionsForm(form) {
  const formData = new FormData(form);

  return normalizeOptionsFormValues({
    like_what: formData.get('like_what') || defaultOptions.like_what,
    like_when: formData.get('like_when') || defaultOptions.like_when,
    like_when_minutes:
      formData.get('like_when_minutes') || defaultOptions.like_when_minutes,
    like_when_percent:
      formData.get('like_when_percent') || defaultOptions.like_when_percent,
    disabled: form.elements.disabled.checked,
  });
}

function syncTimingFieldState(selectedTiming) {
  document
    .querySelectorAll('[data-timing-option]')
    .forEach((optionGroup) => {
      const isActive = optionGroup.dataset.timingOption === selectedTiming;
      optionGroup.classList.toggle('option-group--active', isActive);
      optionGroup
        .querySelector('input[type="number"]')
        ?.toggleAttribute('aria-invalid', false);
    });
}

function updateNumericField(field, nextValue) {
  const normalizedValue = normalizeNumericOption(field.name, nextValue);

  if (field.value !== normalizedValue) {
    field.value = normalizedValue;
  }
}

const loadOptions = async () => {
  const options = await optionManager.get();

  document.querySelectorAll('input').forEach((field) => {
    if (!options.hasOwnProperty(field.name)) return;

    const val = options[field.name];

    if (field.type === 'checkbox') {
      field.checked = Boolean(val);
    } else if (field.type === 'radio') {
      field.checked = field.value === val;
    } else {
      field.value = val;
    }
  });

  syncTimingFieldState(options.like_when);

  chrome.storage.local.get({ [LOG_STORAGE_KEY]: '[no log found]' }, (items) => {
    const log = items[LOG_STORAGE_KEY];
    // Add options state to report issue link
    const reportLink = document.querySelector('#report-link');
    const url = `https://github.com/austencm/youtube-auto-like/issues/new?labels=bug&body=${encodeURIComponent(
      bugReportTemplate + log
    )}`;
    reportLink.setAttribute('href', url);
  });
};

async function handleOptionsChange(e) {
  const newOptions = serializeOptionsForm(e.currentTarget);

  setIsSaving(true);
  await optionManager.set(newOptions);
  await loadOptions();
  setTimeout(() => setIsSaving(false), 300);
}

function setIsSaving(isSaving) {
  document.querySelector('.reload-notice').hidden = isSaving;
  document.querySelector('.saving-text').hidden = !isSaving;
}

loadOptions();

form.addEventListener('change', handleOptionsChange);

form.addEventListener('input', (event) => {
  const field = event.target;

  if (!(field instanceof HTMLInputElement) || field.type !== 'number') {
    return;
  }

  field
    .closest('[data-timing-option]')
    ?.querySelector('input[type="radio"]')
    ?.click();
});

form.addEventListener('focusin', (event) => {
  const field = event.target;

  if (!(field instanceof HTMLInputElement) || field.type !== 'number') {
    return;
  }

  field
    .closest('[data-timing-option]')
    ?.querySelector('input[type="radio"]')
    ?.click();
});

form.addEventListener('blur', (event) => {
  const field = event.target;

  if (!(field instanceof HTMLInputElement) || field.type !== 'number') {
    return;
  }

  updateNumericField(field, field.value);
}, true);

// Check for saved update info
async function checkForSavedRelease() {
  chrome.storage.local.get('latestRelease', ({ latestRelease }) => {
    if (latestRelease) {
      const updateNotice = document.querySelector('.update-notice');
      const latestReleaseLink = document.querySelector('.latest-link');

      latestReleaseLink.innerHTML += ` v${latestRelease.version}`;
      latestReleaseLink.setAttribute('href', latestRelease.downloadUrl);

      updateNotice.removeAttribute('hidden');
    }
  });
}

checkForSavedRelease();
