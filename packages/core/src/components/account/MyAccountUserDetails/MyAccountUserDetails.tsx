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
        <table data-fs-user-details-table>
          <tbody>
            <tr data-fs-user-details-row>
              <th data-fs-user-details-row-label>Name</th>
              <td data-fs-user-details-row-value>{name}</td>
            </tr>
            <tr data-fs-user-details-divider-row>
              <td data-fs-user-details-divider></td>
              <td data-fs-user-details-divider></td>
            </tr>
            <tr data-fs-user-details-row>
              <th data-fs-user-details-row-label>Email</th>
              <td data-fs-user-details-row-value>{email}</td>
            </tr>
            <tr data-fs-user-details-divider-row>
              <td data-fs-user-details-divider></td>
              <td data-fs-user-details-divider></td>
            </tr>
            <tr data-fs-user-details-row>
              <th data-fs-user-details-row-label>Role</th>
              <td data-fs-user-details-row-tags>
                {role.map((r) => (
                  <span key={r} data-fs-user-details-row-value>
                    <Tag>{r}</Tag>
                  </span>
                ))}
              </td>
            </tr>
            <tr data-fs-user-details-divider-row>
              <td data-fs-user-details-divider></td>
              <td data-fs-user-details-divider></td>
            </tr>
            <tr data-fs-user-details-row>
              <th data-fs-user-details-row-label>Organizational unit</th>
              <td data-fs-user-details-row-value>{orgUnit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
