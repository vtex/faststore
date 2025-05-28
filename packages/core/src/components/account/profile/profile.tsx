import { strings } from './i18n'
import styles from './profile.module.scss'
import { useDateFormatter } from './use-date-formatter'

interface UserProfile {
  name: string
  email: string
  id: string
  createdDate: string
}

export interface ProfileSectionProps {
  profile?: UserProfile
  locale?: string
}

/*
 * Renders the /account/profile section
 * TODO: Remove mocked values
 */
export function ProfileSection(props: ProfileSectionProps) {
  const {
    locale = 'en-US',
    profile = {
      name: 'Mr Raccoon',
      email: 'mr@raccoon.com',
      id: 'SC-31441-5279',
      createdDate: '12-01-2010',
    },
  } = props

  const { formatStringDate } = useDateFormatter(locale)

  return (
    <div data-fs-account-profile-section className={styles.section}>
      <header data-fs-account-profile-header>
        <h1 data-fs-account-profile-title>{strings.profile}</h1>
      </header>
      <section data-fs-account-profile-body>
        <table data-fs-account-profile-table>
          <tbody data-fs-account-profile-table-body>
            <tr data-fs-account-profile-table-row>
              <th data-fs-account-profile-table-heading>{strings.name}</th>
              <td data-fs-account-profile-table-data>{profile.name}</td>
            </tr>
            <tr data-fs-account-profile-table-row>
              <th data-fs-account-profile-table-heading>{strings.email}</th>
              <td data-fs-account-profile-table-data>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </td>
            </tr>
            <tr data-fs-account-profile-table-row>
              <th data-fs-account-profile-table-heading>{strings.id}</th>
              <td data-fs-account-profile-table-data>{profile.id}</td>
            </tr>
            <tr data-fs-account-profile-table-row>
              <th data-fs-account-profile-table-heading>
                {strings.createdDate}
              </th>
              <td data-fs-account-profile-table-data>
                {formatStringDate(profile.createdDate)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
