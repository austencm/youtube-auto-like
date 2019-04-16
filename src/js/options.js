import '../img/icon-16.png';
import '../img/icon-19.png';
import '../img/icon-32.png';
import '../img/icon-38.png';
import '../img/icon-48.png';
import '../img/icon-128.png';
import '../css/options.css';

import I18n from './utils/i18n';
import OptionManager from './utils/option-manager';

const defaults = {
  like_what: 'subscribed',
  like_when: 'instantly',
  disabled: false,
};
const optionManager = new OptionManager(defaults);
const i18n = new I18n();
const bugReportTemplate = `
> Thanks for reporting! Please fill in the following info:

OS (Windows / MacOS / etc.):

YouTube version (YouTube / YouTube Gaming):

What happened:

Anything helpful to reproduce the issue:

Current settings (leave this alone):
`;

i18n.populateText();

function serialize(obj) {
  return Object.keys(obj).map(k => `${encodeURIComponent(k)}: ${encodeURIComponent(obj[k])}`).join(encodeURI(', '));
}

const loadOptions = async () => {
  const options = await optionManager.get();

  document
    .querySelectorAll('input')
    .forEach(field => {
      if (!options.hasOwnProperty(field.name)) return;

      const val = options[field.name];

      if (field.type === 'radio' || field.type === 'checkbox') {
        field.checked = field.value === val;
      }
      else {
        field.value = val;
      }
    });
  // Add options state to report issue link
  const reportLink = document.querySelector('#report-link');
  const url = `https://github.com/austencm/youtube-auto-like/issues/new?labels=bug&body=${encodeURI(bugReportTemplate)}${serialize(options)}`;
  reportLink.setAttribute('href', url);
}

const handleOptionsChange = async (e) => {
  const newOptions = {};
  // Extract form data
  Array
    .from((new FormData(e.currentTarget)).entries())
    .forEach(([name, val]) => newOptions[name] = val);

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
document
  .querySelector('#options-form')
  .addEventListener('change', handleOptionsChange);
