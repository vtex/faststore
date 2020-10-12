export interface State {
  state:
    | 'signInForm'
    | 'signInForm.invalidEmailInput'
    | 'signInForm.invalidPasswordInput'
    | 'signInForm.authError'
    | 'emailForm'
    | 'emailForm.invalidEmailInput'
    | 'emailForm.error'
    | 'signUpForm'
    | 'signUpForm.invalidAccessCodeInput'
    | 'signUpForm.invalidPassword'
    | 'signUpForm.passwordDoNotMatch'
    | 'signUpForm.error'

  email?: string
}

export interface Action {
  type: State['state']
  email?: string
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    default:
      return {
        email: action.email ?? state.email,
        state: action.type,
      }
  }
}
