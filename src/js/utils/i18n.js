/**
 * Allows use of i18n message placeholders in HTML
 * Looks for Chrome's __MSG_strName__ syntax by default
 */
export default class I18n {
  constructor(syntax) {
    // Define default placeholder syntax
    this.msg = syntax || {
      start: '__MSG_',
      end: '__'
    };
  }

  localize(text) {
    while(text.includes(this.msg.start)) {
      let keyStart = text.indexOf(this.msg.start) + this.msg.start.length;
      let key = text.substring(keyStart, text.indexOf(this.msg.end, keyStart));
      let placeholder = `${this.msg.start}${key}${this.msg.end}`;
      let localized = chrome.i18n.getMessage(key);

      // Replace all instances of this placeholder with the localized text
      text = text.replace(new RegExp(placeholder, 'g'), localized);
    }

    return text;
  }

  /**
   * Finds and replaces placeholder strings with localized text
   */
  populateText() {
    let node = null;
    let walker = document.createTreeWalker(
      document.body,
      // Only look at text nodes
      NodeFilter.SHOW_TEXT,
      // Ignore script and style tags
      node => 'script style'.includes(node.tagName) ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT,
      false
    );

    // Localize text nodes
    while(node = walker.nextNode()) {
      node.textContent = this.localize(node.textContent);
    }

    // Localize attributes of elements tagged with the 'data-i18n' attribute
    document.querySelectorAll('[data-i18n]').forEach($elem => {
      Array.from($elem.attributes).forEach(({ nodeName, nodeValue }) => {
        $elem.setAttribute(nodeName, this.localize(nodeValue));
      });
    });
  }
}
