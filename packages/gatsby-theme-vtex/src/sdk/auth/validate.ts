const patterns = {
  hasNumber: /\d/,
  lowerCaseLetter: /[a-z]/,
  upperCaseLetter: /[A-Z]/,
  email: /^(([^<>()[\]\\.,;:\s@!"]+(\.[^<>()[\]\\.,;:\s@!"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

export const isValidEmail = (text: string) =>
  patterns.email.test(text.toLowerCase())

export const isValidPassword = (text: string) => {
  const hasMinLength = text.length >= 8
  const hasNumber = patterns.hasNumber.test(text)
  const hasLowerCaseLetter = patterns.lowerCaseLetter.test(text)
  const hasUpperCaseLetter = patterns.upperCaseLetter.test(text)

  return {
    passwordIsValid:
      hasNumber && hasMinLength && hasLowerCaseLetter && hasUpperCaseLetter,
    hasNumber,
    hasMinLength,
    hasLowerCaseLetter,
    hasUpperCaseLetter,
  }
}
