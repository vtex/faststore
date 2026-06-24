export type SecuritySectionLabels = {
  pageTitle?: string
  passwordLabel?: string
  resetPasswordLabel?: string
  currentPasswordLabel?: string
  newPasswordLabel?: string
  showPasswordAria?: string
  cancelLabel?: string
  savePasswordLabel?: string
  passwordRulesIntro?: string
  rule8Chars?: string
  rule1Uppercase?: string
  rule1Lowercase?: string
  rule1Number?: string
  emailRequiredError?: string
  allFieldsRequiredError?: string
  samePasswordError?: string
  passwordUpdatedToast?: string
  passwordFailedToast?: string
}

export const defaultSecurityLabels: Required<SecuritySectionLabels> = {
  pageTitle: 'Security',
  passwordLabel: 'Password',
  resetPasswordLabel: 'Reset password',
  currentPasswordLabel: 'Current Password',
  newPasswordLabel: 'New Password',
  showPasswordAria: 'Show Password',
  cancelLabel: 'Cancel',
  savePasswordLabel: 'Save Password',
  passwordRulesIntro: 'Your password must have at least:',
  rule8Chars: '8 characters',
  rule1Uppercase: '1 uppercase letter',
  rule1Lowercase: '1 lowercase letter',
  rule1Number: '1 number',
  emailRequiredError: 'Email is required',
  allFieldsRequiredError: 'All fields are required',
  samePasswordError: 'New password cannot be the same as the current password',
  passwordUpdatedToast: 'Password updated successfully',
  passwordFailedToast: 'Failed to set password.',
}

export function resolveSecurityLabels(
  labels?: SecuritySectionLabels
): Required<SecuritySectionLabels> {
  return { ...defaultSecurityLabels, ...labels }
}
