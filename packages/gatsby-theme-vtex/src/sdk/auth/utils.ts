import { navigate } from 'gatsby'

export const onLoginSuccessful = (returnUrl?: string) => {
  // Login successfull, let's go back to home
  navigate(returnUrl ?? '/')
}
