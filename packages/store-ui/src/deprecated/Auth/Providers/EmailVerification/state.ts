export interface State {
  state:
    | 'emailForm'
    | 'emailForm.invalidEmailInput'
    | 'emailForm.authError'
    | 'accessCodeForm'
    | 'accessCodeForm.invalidAccessCode'
    | 'accessCodeForm.badAccessCode'
    | 'accessCodeForm.authError'
  email?: string
}

export interface Action {
  type: State['state']
  email?: string
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'accessCodeForm':
      return {
        ...state,
        state: 'accessCodeForm',
        email: action.email,
      }

    default:
      return {
        ...state,
        state: action.type,
      }
  }
}
