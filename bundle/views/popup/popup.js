/*
* @Author: Austen Morgan
* @Date:   2016-07-03 20:04:37
* @Last Modified by:   AustenMorgan
* @Last Modified time: 2016-10-26 19:37:48
*/

'use strict';

function openOptions() {
	chrome.runtime.openOptionsPage();
}

document.querySelector('#openOptions').addEventListener('click', openOptions);
