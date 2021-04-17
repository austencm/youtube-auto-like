/**
 * Helper for generating debug info sent with bug reports
 */
export default class Debug {
  constructor() {
    this.messages = [];

    this.log = this.log.bind(this);
    this.save = this.save.bind(this);

    this.log(new Date().toDateString());
    this.log(navigator.userAgent);
  }

  log() {
    const message = Array.from(arguments).join(' ');
    this.messages.push(message);

    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[DEBUG] %c${message}`, 'font-style: italic', '');
    }
  }

  save(options) {
  	return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ log: this.messages.join('\n') }, resolve);
    });
  }
}
