/**
 * Helper for generating debug info sent with bug reports
 */
export default class Debug {
  constructor() {
    this.messages = [];

    this.log = this.log.bind(this);
    this.save = this.save.bind(this);

    this.log(`YouTube Auto Like v${chrome.runtime.getManifest().version}`);
    this.log(new Date().toDateString());
    this.log('User agent:', `\n${window.navigator.userAgent}`);
  }

  log() {
    const message = Array.from(arguments).join(' ');
    this.messages.push(message);

    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[DEBUG] %c${message}`, 'font-style: italic', '');
    }
  }

  save() {
  	return new Promise((resolve) => {
      chrome.storage.sync.set({ log: this.messages.join('\n') }, resolve);
    });
  }
}
