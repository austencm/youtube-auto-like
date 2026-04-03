const MAX_LOG_ENTRIES = 150;
const LOG_STORAGE_KEY = 'debugLog';

function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

function stringifyPart(part) {
  if (part instanceof Error) {
    return [part.name, part.message, part.stack].filter(Boolean).join('\n');
  }

  if (typeof part === 'string') {
    return part;
  }

  try {
    return JSON.stringify(part);
  } catch (error) {
    return String(part);
  }
}

/**
 * Helper for generating debug info sent with bug reports
 */
export default class Debug {
  constructor() {
    this.messages = [];

    this.log = this.log.bind(this);
    this.save = this.save.bind(this);
    this.serialize = this.serialize.bind(this);

    this.log(`YouTube Auto Like v${chrome.runtime.getManifest().version}`);
    this.log('Date:', formatTimestamp());
    this.log('User agent:', window.navigator.userAgent);
  }

  log() {
    const message = Array.from(arguments).map(stringifyPart).join(' ');
    const entry = `[${formatTimestamp()}] ${message}`;

    this.messages.push(entry);

    if (this.messages.length > MAX_LOG_ENTRIES) {
      this.messages = this.messages.slice(-MAX_LOG_ENTRIES);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[DEBUG] %c${entry}`, 'font-style: italic', '');
    }
  }

  serialize() {
    return this.messages.join('\n');
  }

  save() {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [LOG_STORAGE_KEY]: this.serialize() }, resolve);
    });
  }
}

export { LOG_STORAGE_KEY, MAX_LOG_ENTRIES, stringifyPart };
