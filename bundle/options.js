'use strict';

function formDataToObject(formData) {
	var dataObj = {};

	for ( var option of formData.entries() ) {
	  dataObj[ option[0] ] = option[1];
	}

	return dataObj;
}

function saveOptions(e) {
	e.preventDefault();

	var formDataObj = formDataToObject( new FormData(e.target) );

	var btn = document.getElementById('save');
	btn.textContent = 'Saving...';
	btn.setAttribute('disabled', true);

  chrome.storage.sync.set(formDataObj, function() {
    btn.textContent = 'Saved!';

    setTimeout(function() {
      btn.textContent = 'Save';
      btn.removeAttribute('disabled');
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    likeWhat: 'subscribed',
    // likeWhitelist: '',
    // likeBlacklist: ''
  }, function(items) {
    document.querySelector('input[name="likeWhat"][value="' + items.likeWhat + '"]').click();
    // document.getElementById('likeWhitelist').textContent = items.likeWhitelist;
    // document.getElementById('likeBlacklist').textContent = items.likeBlacklist;
  });
}

document.getElementById('options').addEventListener('submit', saveOptions);

restoreOptions();