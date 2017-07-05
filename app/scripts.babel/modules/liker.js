class Liker {
    constructor(options) {
        this.options = options
    }

    reset() {
        this.btns = {}
    }

    waitForButtons(callback) {
        this.btns.like = document.querySelector('.like-button-renderer-like-button-unclicked')
        this.btns.dislike = document.querySelector('.like-button-renderer-dislike-button-unclicked')

        if (this.btns.like && this.btns.dislike)
            callback()
        else
            setTimeout(() => this.waitForButtons(callback), 1000 )
    }

    attemptLike() {
        // console.log('attempting like...')

        this.btns.like.click()

        if ( !this.isVideoRated() )
            setTimeout(() => this.attemptLike(), 1000 )
    }

    isVideoRated() {
        return this.btns.like.classList.contains('hid') ||
               this.btns.dislike.classList.contains('hid')
    }

    isUserSubscribed() {
        return document.querySelector('.yt-uix-subscription-button').classList.contains('hover-enabled')
    }

    init() {
        // console.log('initializing...')

        this.reset()

        this.waitForButtons(() => {
            if (
                this.isVideoRated() ||
                ( this.options.like_what === 'subscribed' && !this.isUserSubscribed() )
            ) {
                return
            }

            this.attemptLike()
        })
    }
}