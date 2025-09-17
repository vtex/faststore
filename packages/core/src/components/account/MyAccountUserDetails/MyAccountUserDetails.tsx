import Tag from '../components/MyAccountTag'
import AccountTable from '../components/MyAccountTable'
import AccountHeader from '../components/MyAccountHeader'
import styles from './styles.module.scss'

type MyAccountUserDetailsProps = {
  userDetails: {
    name: string
    email: string
    role: string[]
    orgUnit: string
  }
}

export default function MyAccountUserDetails({
  userDetails: { name, email, role, orgUnit },
}: MyAccountUserDetailsProps) {
  return (
    <section className={styles.section}>
      <AccountHeader pageTitle="User details" />
      <div data-fs-user-details-container>
        <AccountTable
          rows={[
            { heading: 'Name', data: name },
            { heading: 'Email', data: email },
            {
              heading: 'Role',
              data: role.map((r) => (
                <span key={r} data-fs-user-details-row-value>
                  <Tag>{r}</Tag>
                </span>
              )),
            },
            { heading: 'Organizational unit', data: orgUnit },
          ]}
        />
      </div>
    </section>
  )
}
