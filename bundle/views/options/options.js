'use strict';

$.fn.serializeObject = function() {
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

function saveOptions() {
  var options = $('#options').serializeObject();
  console.log(options);

  chrome.storage.sync.set(options);
}

function restoreOptions() {
  chrome.storage.sync.get({ likeWhat: 'subscribed' }, function(items) {
    $('input[name="likeWhat"][value="' + items.likeWhat + '"]').click();
  });
  chrome.storage.sync.get({ dislikeWhat: 'subscribed' }, function(items) {
    $('input[name="dislikeWhat"][value="' + items.dislikeWhat + '"]').click();
  });
}

$(document).on('click', 'input[type="radio"]', saveOptions);

$('#links a').hover(function() {
  $('#hover-label').html( $(this).find('label').html() );
}, function() {
  $('#hover-label').html('');
});

restoreOptions();