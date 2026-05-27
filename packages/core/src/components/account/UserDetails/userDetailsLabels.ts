export type UserDetailsSectionLabels = {
  pageTitle?: string
  nameLabel?: string
  emailLabel?: string
  roleLabel?: string
  orgUnitLabel?: string
}

export const defaultUserDetailsLabels: Required<UserDetailsSectionLabels> = {
  pageTitle: 'User details',
  nameLabel: 'Name',
  emailLabel: 'Email',
  roleLabel: 'Role',
  orgUnitLabel: 'Organizational unit',
}

export function resolveUserDetailsLabels(
  labels?: UserDetailsSectionLabels
): Required<UserDetailsSectionLabels> {
  return { ...defaultUserDetailsLabels, ...labels }
}
