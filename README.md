<img width="100" height="100" src="https://i.imgur.com/CwAIwN6.png" align="right" />

# YouTube Auto Like

<<<<<<< HEAD
## Presentation
A plugin that likes videos from channels you subscribe to, so you never forget to support your favorite content creators. No login required.

Available in the [Firefox Add-ons store](https://addons.mozilla.org/en/firefox/addon/youtube_auto_like/) 
The chrome extension is currently banned from the store ([old link](https://chrome.google.com/webstore/detail/youtube-auto-like/loodalcnddclgnfekfomcoiipiohcdim)).

## Issues
You can report a issue [here](https://github.com/Taknok/youtube-auto-like/issues/new) and check the current [issues](https://github.com/Taknok/youtube-auto-like/issues).
=======
Never forget to like a video again.

**Feb 2021: Sadly, Chrome removed this extension for violating [YouTube's terms of service](https://www.youtube.com/t/terms) (specifically the part about causing inaccurate measurements of user engagement). You can still load the extension locally by following these steps. Only do this for extensions you trust.**

1. Download the latest release: https://github.com/austencm/youtube-auto-like/releases/latest/download/release.zip
2. Unzip `release.zip` and put it somewhere it won't get deleted accidentally
3. Open your extensions page in Chrome (in the top right, click the <img width="18" height="18" src="https://lh3.googleusercontent.com/5nlvcUtFevZLAkSJALBl5Fa8thP_-mGFnUngJLuAFzt0jws-Lr09I9mIfawW4vKiT6k=w36-h36" alt="puzzle piece"> icon, then "Manage Extensions" (at the bottom of the popup)
4. Turn on Developer Mode (in the top right)
5. Click 'Load unpacked' and select the unzipped `release` folder
6. Set your options again (sorry, the browser thinks it's a new extension and options get reset. I don't have a good way around this.)

Extensions loaded this way are unable to update automatically. Keep an eye out for a badge on the icon that indicates a new version is available.

## Gimme
> <s>Chrome</s> (see above)

> [Firefox (by @Taknok)](https://addons.mozilla.org/en-US/firefox/addon/youtube_auto_like/)

## Translations
Feel free to contribute with a [pull request](https://github.com/austencm/youtube-auto-like/pulls) or grab [the JSON file](https://raw.githubusercontent.com/austencm/youtube-auto-like/master/app/_locales/en/messages.json), translate it, and [send it back to me](mailto:heyausten@gmail.com).
>>>>>>> 4461d9a76ec51971660ab9797cdedbc7af386b47

## Releases
| Version     | Date           | Changelog |
| ----------- | -------------- | --------- |
| **`v2.7.1`** | _May 23, 2021_ | <ul><li>Fix update checker not loading</li></ul> |
| **`v2.7.0`** | _May 23, 2021_ | <ul><li>Make minutes & percent configurable</li><li>Fix a visual bug caused by a YouTube change</li><li>Partial RU translation from @Makishima</li><li>Better logging</li></ul> |
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

<<<<<<< HEAD
Do you know another language? _I sure don't._ Feel free to contribute with a [pull request](https://github.com/Taknok/youtube-auto-like/pulls), or grab [the JSON file](https://raw.githubusercontent.com/Taknok/youtube-auto-like/master/app/_locales/en/messages.json), translate it, and [send it back to me](mailto:pg.developper.fr@gmail.com).

## Developpers
The debug mode option can be display in the addon popup by entering the konami code while the addon popup is opened.<br>
:warning: `browser.storage.sync` can cause issues when loaded temporarily, change it by `browser.storage.local` in **scripts/option-manager.js**.<br>
[PR](https://github.com/Taknok/youtube-auto-like/pulls) are welcomed :)

## Credits
- [Austencm](https://github.com/austencm/youtube-auto-like)
- [DeadSix27](https://github.com/DeadSix27) ~ DE translation
- [JKetelaar](https://github.com/JKetelaar) ~ NL translation
- [Szmyk](https://github.com/Szmyk) ~ PL translation
- [Hultan](https://github.com/Hultan) ~ SV translation
- [C4H7Cl2O4P](https://github.com/C4H7Cl2O4P) ~ UK translation
- [Alexandre Pennetier](https://github.com/alexandre-pennetier) ~ FR translation
=======
Details of releases before v2.0.0 are scarce due to the author not knowing how to git.

## Acknowledgments
| Name | Contribution |
|-|-|
| [@Taknok](https://github.com/Taknok) | [Firefox edition](https://addons.mozilla.org/en-US/firefox/addon/youtube_auto_like/)<br />Language-independent button selection method<br />ES, FR translations |
| [@JKetelaar](https://github.com/JKetelaar) | NL translation |
| [@Szmyk](https://github.com/Szmyk) | PL translation |
| [@moweME](https://github.com/moweME) | DE translation |
| [@mariovalney](https://github.com/mariovalney) | PT_BR translation |
| [@Borian23](https://github.com/Borian23) | Updated PL translation |
| [@UtkuGARIP](https://github.com/@UtkuGARIP) | TR translation |
| [@Makishima](https://github.com/@Makishima) | RU translation |

## Feed my kitties 🐈
They're _starving_, but could the food be room temp and a different flavor thank mew.<br />
https://www.buymeacoffee.com/austen
>>>>>>> 4461d9a76ec51971660ab9797cdedbc7af386b47
