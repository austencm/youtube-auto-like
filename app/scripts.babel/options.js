////////////////////////////////////////////
// OptionManager loaded here via manifest //
////////////////////////////////////////////

// Create an OptionManager to help us out
let optionManager = new OptionManager({
  like_what: 'subscribed'
})

function onFieldChange() {
  // Save the new state
  optionManager.set({
    [this.name]: this.value
  })
}

// Restore options
optionManager.get().then((options) => {
  // Populate current option data
  document
    .querySelector(`input[name="like_what"][value="${options.like_what}"]`)
    .click()
})

// Catch when the user changes an input so we can save it
document
  .querySelectorAll('input')
  .forEach((field) => {
    field.addEventListener( 'click', onFieldChange.bind(field) )
  })
