/*
* @Author: Austen Morgan
* @Date:   2016-07-03 20:04:37
* @Last Modified by:   Austen Morgan
* @Last Modified time: 2016-07-04 00:36:45
*/

'use strict';

// function loadChannelLists() {

// }

// function whitelist() {
// 	chrome.storage.sync.set({'whitelist'});
// }

function openOptions() {
	chrome.runtime.openOptionsPage();
}

// document.getElementById('whitelist').addEventListener('click', whitelist);
// document.getElementById('blacklist').addEventListener('click', blacklist);
document.getElementById('openOptions').addEventListener('click', openOptions);
