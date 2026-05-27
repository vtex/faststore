import Tag from '../components/Tag'
import AccountTable from '../components/Table'
import AccountHeader from '../components/Header'
import {
  type UserDetailsSectionLabels,
  resolveUserDetailsLabels,
} from './userDetailsLabels'
import styles from './styles.module.scss'

type UserDetailsProps = {
  userDetails: {
    username: string
    name: string
    email: string
    phone: string
    role: string[]
    orgUnit: string
  }
  labels?: UserDetailsSectionLabels
}

export default function UserDetails({
  userDetails: { username, name, email, phone, role, orgUnit },
  labels: labelsProp,
}: UserDetailsProps) {
  const labels = resolveUserDetailsLabels(labelsProp)

  return (
    <section className={styles.section}>
      <AccountHeader pageTitle={labels.pageTitle} />
      <div data-fs-user-details-container>
        <AccountTable
          rows={[
            { heading: labels.nameLabel, data: name ? name : '–' },
            { heading: 'Username', data: username ? username : '–' },
            { heading: 'Phone number', data: phone ? phone : '–' },
            { heading: labels.emailLabel, data: email },
            {
              heading: labels.roleLabel,
              data: (
                <span data-fs-user-details-row-tags>
                  {role.map((r) => (
                    <Tag key={r}>{r}</Tag>
                  ))}
                </span>
              ),
            },
            { heading: labels.orgUnitLabel, data: orgUnit },
          ]}
        />
      </div>
    </section>
  )
}
