import Tag from '../components/MyAccountTag'
import AccountTable from '../components/MyAccountTable'
import AccountHeader from '../components/MyAccountHeader'
import styles from './styles.module.scss'

type MyAccountUserDetailsProps = {
  userDetails: {
    username: string
    name: string
    email: string
    phone: string
    role: string[]
    orgUnit: string
  }
}

export default function MyAccountUserDetails({
  userDetails: { username, name, email, phone, role, orgUnit },
}: MyAccountUserDetailsProps) {
  return (
    <section className={styles.section}>
      <AccountHeader pageTitle="User details" />
      <div data-fs-user-details-container>
        <AccountTable
          rows={[
            { heading: 'Name', data: name ? name : '–' },
            { heading: 'Username', data: username ? username : '–' },
            { heading: 'Phone number', data: phone ? phone : '–' },
            { heading: 'Email', data: email },
            {
              heading: 'Role',
              data: (
                <span data-fs-user-details-row-tags>
                  {role.map((r) => (
                    <Tag key={r}>{r}</Tag>
                  ))}
                </span>
              ),
            },
            { heading: 'Organizational unit', data: orgUnit },
          ]}
        />
      </div>
    </section>
  )
}
