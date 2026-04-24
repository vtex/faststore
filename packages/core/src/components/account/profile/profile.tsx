import { Link } from '@faststore/ui'
import AccountTable from '../components/MyAccountTable'
import AccountHeader from '../components/MyAccountHeader'
import { strings } from './i18n'
import styles from './profile.module.scss'
import { useDateFormatter } from './use-date-formatter'

interface UserProfile {
  name: string | null
  email: string | null
  id: string | null
  createdDate?: string | null
}

export interface ProfileSectionProps {
  profile?: UserProfile
  locale?: string
}

/*
 * Renders the /account/profile section
 */
export function ProfileSection({
  profile,
  locale = 'en-US',
}: ProfileSectionProps) {
  const { formatStringDate } = useDateFormatter(locale)

  return (
    <div data-fs-account-profile-section className={styles.section}>
      <AccountHeader pageTitle={strings.profile} />
      <section data-fs-account-profile-body>
        <AccountTable
          rows={[
            { heading: strings.name, data: profile?.name },
            {
              heading: strings.email,
              data: (
                <Link href={`mailto:${profile?.email}`}>{profile?.email}</Link>
              ),
            },
            { heading: strings.id, data: profile?.id },
            ...(profile?.createdDate
              ? [
                  {
                    heading: strings.createdDate,
                    data: formatStringDate(profile.createdDate),
                  },
                ]
              : []),
          ]}
        />
      </section>
    </div>
  )
}
