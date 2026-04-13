import { Link } from '@faststore/ui'
import { useIntl } from 'react-intl'
import AccountTable from '../components/MyAccountTable'
import AccountHeader from '../components/MyAccountHeader'
import { messageIds } from './i18n'
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
export function ProfileSection({ profile, locale }: ProfileSectionProps) {
  const intl = useIntl()
  const { formatStringDate } = useDateFormatter(locale ?? intl.locale)

  return (
    <div data-fs-account-profile-section className={styles.section}>
      <AccountHeader
        pageTitle={intl.formatMessage({ id: messageIds.profile })}
      />
      <section data-fs-account-profile-body>
        <AccountTable
          rows={[
            {
              heading: intl.formatMessage({ id: messageIds.name }),
              data: profile?.name,
            },
            {
              heading: intl.formatMessage({ id: messageIds.email }),
              data: (
                <Link href={`mailto:${profile?.email}`}>{profile?.email}</Link>
              ),
            },
            {
              heading: intl.formatMessage({ id: messageIds.id }),
              data: profile?.id,
            },
            ...(profile?.createdDate
              ? [
                  {
                    heading: intl.formatMessage({ id: messageIds.createdDate }),
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
