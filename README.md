<img width="100" height="100" src="https://i.imgur.com/CwAIwN6.png" align="right" />

# YouTube Auto Like

Never forget to like a video again.

**Feb 2021: Sadly, Chrome removed this extension for violating [YouTube's terms of service](https://www.youtube.com/t/terms) (specifically the part about causing inaccurate measurements of user engagement). You can still load the extension locally by following these steps. Only do this for extensions you trust.**

1. Download the latest release: https://github.com/austencm/youtube-auto-like/releases/latest/download/release.zip
2. Unzip `release.zip` and put it somewhere it won't get deleted accidentally
3. Open your extensions page in Chrome (in the top right, click ![the 3 dots](https://lh3.googleusercontent.com/E2q6Vj9j60Dw0Z6NZFEx5vSB9yoZJp7C8suuvQXVA_2weMCXstGD7JEvNrzX3wuQrPtL=w36-h36) > More Tools > Extensions)
4. Turn on Developer Mode (in the top right)
5. Click 'Load unpacked' and select the unzipped `release` folder

Extensions loaded this way are unable to update automatically. Keep an eye out for a badge on the icon that indicates a new version is available.

## Gimme
> <s>Chrome</s> (see above)

> [Firefox (by @Taknok)](https://addons.mozilla.org/en-US/firefox/addon/youtube_auto_like/)

## Translations
Feel free to contribute with a [pull request](https://github.com/austencm/youtube-auto-like/pulls) or grab [the JSON file](https://raw.githubusercontent.com/austencm/youtube-auto-like/master/app/_locales/en/messages.json), translate it, and [send it back to me](mailto:heyausten@gmail.com).

## Releases
| Version     | Date           | Changelog |
| ----------- | -------------- | --------- |
| **`v2.6.0`** | _Apr 17, 2021_ | <ul><li>YouTube changed the subscribe button, fixed detection</li><li>Automatic update checking</li><li>Update to manifest v3</li><li>TR translation from @UtkuGARIP</li><li>Removed code for old YouTube</li></ul> |
| **`v2.5.2`** | _Oct 22, 2019_ | <ul><li>Fix logging code causing error in old YouTube</li></ul> |
| **`v2.5.1`** | _Oct 17, 2019_ | <ul><li>Fix misidentifying comment like buttons on homepage and trying to click them</li></ul> |
| **`v2.5.0`** | _Oct 16, 2019_ | <ul><li>YouTube changed a thing and the first video viewed was not getting liked</li><li>Now creates a log when the extension runs that will be included with bug reports</li><li>Polish translation additions from @Borian23</li></ul> |
| **`v2.4.0`** | _Apr 15, 2019_ | <ul><li>Switch to Webpack</li><li>Fix liker thinking user wasn't subscribed when navigating to a video from the homepage</li><li>PT_BR translation</li></ul> |
| **`v2.3.2`** | _Dec 3, 2018_ | <ul><li>Fix font not loading</li><li>Better DE translation</li>
| **`v2.3.1`** | _Nov 12, 2018_ | <ul><li>Fix bugs caused by YouTube updates</li></ul> |
| **`v2.3.0`** | _Jun 21, 2018_ | <ul><li>Add option to like after watching 50%</li><li>PL translation</li></ul> |
| **`v2.2.0`** | _Jan 4, 2018_ | <ul><li>Support for YouTube Gaming</li></ul> |
| **`v2.1.0`** | _Jan 3, 2018_ | <ul><li>Add timed like option</li><li>NL, DE translations</li></ul> |
| **`v2.0.1`** | _Aug 21, 2017_ | <ul><li>I18n improvements</li><li>Misc fixes</li></ul> |
| **`v2.0.0`** | _Jul 4, 2017_ | <ul><li>Total rewrite and graphic updates</li></ul> |

Details of releases before v2.0.0 are scarce due to the author not knowing how to git.

## Acknowledgments
| Name | Contribution |
|-|-|
| @Taknok | [Firefox edition](https://addons.mozilla.org/en-US/firefox/addon/youtube_auto_like/)<br />Language-independent button selection method<br />ES, FR translations |
| @JKetelaar | NL translation |
| @Szmyk | PL translation |
| @moweME | DE translation |
| @mariovalney | PT_BR translation |
| @Borian23 | Updated PL translation |
| @UtkuGARIP | TR translation |

## Feed my kitties 🐈
They're _starving_, but could the food be room temp and a different flavor thank mew.<br />
https://www.buymeacoffee.com/austen
