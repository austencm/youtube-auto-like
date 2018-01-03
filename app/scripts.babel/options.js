/////////////////////////////////////////
// Loaded modules: I18n, OptionManager //
/////////////////////////////////////////

const defaults = {
  like_what: 'subscribed',
  like_when: 'instantly',
  disabled: false,
};
const optionManager = new OptionManager(defaults);
const i18n = new I18n();

i18n.populateText();

// Load options
optionManager.get().then(options => {
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
});

// When the user changes an option, save it
document
  .querySelector('#options-form')
  .addEventListener('change', e => {
    const newOptions = {};
    // Extract form data
    Array
      .from((new FormData(e.currentTarget)).entries())
      .forEach(([name, val]) => newOptions[name] = val);

    optionManager.set(newOptions).then(optionManager.get).then(console.log);
  });
