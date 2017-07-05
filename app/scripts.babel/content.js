'use strict'

const IS_MATERIAL = !document.body.id

let optionManager = new OptionManager({
  like_what: 'subscribed'
})

optionManager.get().then((options) => {
  if (IS_MATERIAL) {
  	let liker = new MaterialLiker(options)
  	document.addEventListener('yt-page-data-updated', () => liker.init() )
  }
  else {
  	let liker = new Liker(options)
  	liker.init()
		window.addEventListener('spfdone', () => liker.init() )
  }
})


