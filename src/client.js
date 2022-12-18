import React, { Component } from 'react'
import * as ReactDOM from 'react-dom/client'

let
  VALID_CHARS_CONDITIONS = [ // Naive password validation
    /[a-z]/, // lower-case
    /[A-Z]/, // upper-case
    /[0-9]/, // number
    /[`~!@#$%^&*()\-_=+\[\];:'"\\|,<.>/?]/, // special character
  ],
  App = class extends Component {
    constructor(props) {
      super(props)

      this.state = {
        passwordShown: false,
      }
    }

    togglePasswordShown = () => {
      this.setState(state => ({ passwordShown: !state.passwordShown }))
    }
    handleSubmit = ev => {
      ev.preventDefault()
      let $form = ev.target

      // If the input type remains 'text' during submission, the password is
      // added to the browser's autocomplete list, which is a security issue.
      // We therefore force the 'password' type here. We also set the state
      // appropriately, but this won't take effect until *after* submission,
      // so we cannot rely on it here.
      $form.elements.password.type = 'password'
      this.setState({ passwordShown: false })

      // Reset the invalid markers
      for (let $ of $form.elements) delete $.dataset.invalid

      // Serialize form data. More on that here:
      //
      // https://developer.mozilla.org/en-US/docs/Web/API/FormData
      let data = Object.fromEntries(new FormData($form).entries())
      console.log(JSON.stringify(data))
      $form.reset()
    }
    handleInvalid = ev => {
      ev.target.dataset.invalid = true
    }
    handlePasswordChange = ev => {
      let
        $passwordInput = ev.target,
        password = $passwordInput.value,
        isValidPasswordCharacterMix = VALID_CHARS_CONDITIONS.every(r => r.test(password))

      if (!isValidPasswordCharacterMix) $passwordInput.setCustomValidity('Please use at least one lower-case and upper-case letter, a number, and a special character')
      else $passwordInput.setCustomValidity('')
      if ($passwordInput.form.dataset.submitted) $passwordInput.reportValidity()
    }

    render() {
      let { passwordShown } = this.state

      return (
        <>
          <form onSubmit={this.handleSubmit} onInvalid={this.handleInvalid}>
            <label>
              <span>Name:</span>
              <input type="text" name="name" placeholder=" " required />
            </label>
            <label>
              <span>Email:</span>
              <input type="email" name="email" placeholder=" " required />
            </label>
            <div>
              <label>
                <span>Password:</span>
                <input type={passwordShown ? 'text' : 'password'} placeholder=" " name="password" minLength="8" required
                       onChange={this.handlePasswordChange}/>
              </label>
              <button type="button" onClick={this.togglePasswordShown}>
                {passwordShown ? 'Hide' : 'Show'} password
              </button>
            </div>
            <button>
              Sign up
            </button>
          </form>
          {/*
           When a screen-reader user with poor vision activates the show/hide
           password button, nothing actually happens (they don't hear
           anything). To ensure the user understands the effect of the button
           we use an ARIA live region (below) to announce what happened. The
           live region is placed outside the form so that it is not read out
           as part of the field label.

           https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
           */}
          <p aria-live="polite">
            {passwordShown ? 'The password is now shown and audible to people around you.' : ''}
          </p>
        </>
      )
    }
  }

ReactDOM.createRoot(document.getElementById('app')).render(<App />)
