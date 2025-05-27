import Tag from '../components/MyAccountTag'
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
      <h1 data-fs-user-details-title>User details</h1>
      <div data-fs-user-details-container>
        <div data-fs-user-details-row>
          <span data-fs-user-details-row-label>Name</span>
          <span data-fs-user-details-row-value>{name}</span>
        </div>

        <hr data-fs-user-details-divider />

        <div data-fs-user-details-row>
          <span data-fs-user-details-row-label>Email</span>
          <span data-fs-user-details-row-value>{email}</span>
        </div>

        <hr data-fs-user-details-divider />

        <div data-fs-user-details-row>
          <span data-fs-user-details-row-label>Role</span>
          <div data-fs-user-details-row-tags>
            {role.map((r) => (
              <span key={r} data-fs-user-details-row-value>
                <Tag>{r}</Tag>
              </span>
            ))}
          </div>
        </div>

        <hr data-fs-user-details-divider />

        <div data-fs-user-details-row>
          <span data-fs-user-details-row-label>Organizational unit</span>
          <span data-fs-user-details-row-value>{orgUnit}</span>
        </div>
      </div>
    </section>
  )
}
