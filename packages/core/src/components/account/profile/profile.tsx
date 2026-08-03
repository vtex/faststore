import { Link } from '@faststore/ui'
import AccountTable from '../components/Table'
import AccountHeader from '../components/Header'
import styles from './profile.module.scss'
import { useDateFormatter } from './use-date-formatter'

interface UserProfile {
  name: string | null
  email: string | null
  id: string | null
  createdDate?: string | null
}

export type ProfileSectionLabels = {
  pageTitle?: string
  nameLabel?: string
  emailLabel?: string
  idLabel?: string
  createdDateLabel?: string
}

const defaultProfileLabels: Required<ProfileSectionLabels> = {
  pageTitle: 'Profile',
  nameLabel: 'Name',
  emailLabel: 'Email',
  idLabel: 'ID',
  createdDateLabel: 'Created date',
}

export interface ProfileSectionProps {
  profile?: UserProfile
  locale?: string
  labels?: ProfileSectionLabels
}

/*
 * Renders the /account/profile section
 */
export function ProfileSection({
  profile,
  locale = 'en-US',
  labels,
}: ProfileSectionProps) {
  const { formatStringDate } = useDateFormatter(locale)
  const pageTitle = labels?.pageTitle ?? defaultProfileLabels.pageTitle
  const nameLabel = labels?.nameLabel ?? defaultProfileLabels.nameLabel
  const emailLabel = labels?.emailLabel ?? defaultProfileLabels.emailLabel
  const idLabel = labels?.idLabel ?? defaultProfileLabels.idLabel
  const createdDateLabel =
    labels?.createdDateLabel ?? defaultProfileLabels.createdDateLabel

  return (
    <div data-fs-account-profile-section className={styles.section}>
      <AccountHeader pageTitle={pageTitle} />
      <section data-fs-account-profile-body>
        <AccountTable
          rows={[
            { heading: nameLabel, data: profile?.name },
            {
              heading: emailLabel,
              data: (
                <Link href={`mailto:${profile?.email}`}>{profile?.email}</Link>
              ),
            },
            { heading: idLabel, data: profile?.id },
            ...(profile?.createdDate
              ? [
                  {
                    heading: createdDateLabel,
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
