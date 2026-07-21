export type UserDetailsSectionLabels = {
  pageTitle?: string
  nameLabel?: string
  usernameLabel?: string
  emailLabel?: string
  phoneLabel?: string
  roleLabel?: string
  orgUnitLabel?: string
}

export const defaultUserDetailsLabels: Required<UserDetailsSectionLabels> = {
  pageTitle: 'User details',
  nameLabel: 'Name',
  usernameLabel: 'Username',
  emailLabel: 'Email',
  phoneLabel: 'Phone number',
  roleLabel: 'Role',
  orgUnitLabel: 'Organizational unit',
}

export function resolveUserDetailsLabels(
  labels?: UserDetailsSectionLabels
): Required<UserDetailsSectionLabels> {
  return { ...defaultUserDetailsLabels, ...labels }
}
