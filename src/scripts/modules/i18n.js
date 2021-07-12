/*
 * Allows use of i18n message placeholders in HTML
 * Looks for Chrome's __MSG_strName__ syntax by default
 */
class I18n {
	constructor(syntax) {
		// Define default placeholder syntax
		this.msg = syntax || {
			start: '__MSG_',
			end: '__'
		}
	}

	/*
	 * Finds and replaces placeholder strings with localized text
	 */
	populateText() {
		let node,
				walker = document.createTreeWalker(
										document.body,
										// Only look at text nodes
										NodeFilter.SHOW_TEXT,
										// Ignore script and style tags
										(node) => 'script style'.includes(node.tagName) ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT,
										false
									)

		// Loop through all text nodes
		while( node = walker.nextNode() ) {
			// We only care about this text if it contains placeholder syntax
			while( node.textContent.includes(this.msg.start) ) {
				let text = node.textContent,
						keyStart = text.indexOf(this.msg.start) + this.msg.start.length,
						key = text.substring( keyStart, text.indexOf(this.msg.end, keyStart) ),
						placeholder = `${this.msg.start}${key}${this.msg.end}`,
						localized = chrome.i18n.getMessage(key)

				// Replace all instances of this placeholder with the localized text
				node.textContent = text.replace(new RegExp(placeholder, 'g'), localized)
			}
		}
	}
}
