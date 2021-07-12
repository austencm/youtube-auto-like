/**
 * Helper for generating debug info sent with bug reports
 */
import Bowser from 'bowser';
export default class Debug {
  constructor() {
    this.messages = [];

    this.log = this.log.bind(this);
    this.save = this.save.bind(this);

    const parsedUserAgent = JSON.stringify(Bowser.parse(window.navigator.userAgent), null, 2);

    this.log(`YouTube Auto Like v${chrome.runtime.getManifest().version}`);
    this.log(new Date().toDateString());
    this.log('User agent:', `\n${parsedUserAgent}`);
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
