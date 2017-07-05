class MaterialLiker {
    constructor(options) {
        this.options = options
    }

    reset() {
        this.btns = {}
    }

    waitForButtons(callback) {
        this.btns.like = document.querySelector('ytd-app [aria-label^="like this"]')
        this.btns.dislike = document.querySelector('ytd-app [aria-label^="dislike this"]')

        if (this.btns.like || this.btns.dislike) {
            if (!this.btns.like) {
                this.btns.like = this.btns.dislike
                            .closest('ytd-toggle-button-renderer')
                            .previousSibling
                            .querySelector('button')
            }
            else if (!this.btns.dislike) {
                this.btns.dislike = this.btns.like
                            .closest('ytd-toggle-button-renderer')
                            .nextSibling
                            .querySelector('button')
            }

            callback()
        }
        else
            setTimeout(() => this.waitForButtons(callback), 1000 )
    }

    isVideoRated() {
        return this.btns.like.classList.contains('style-default-active') ||
               this.btns.dislike.classList.contains('style-default-active')
    }

    isUserSubscribed() {
        let subscribeButton = document.querySelector('#subscribe-button paper-button')
        return subscribeButton && subscribeButton.hasAttribute('subscribed')
    }

    attemptLike() {
        // console.log('attempting like...')

        this.btns.like.click()
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