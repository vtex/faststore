import { useIntl } from 'react-intl'
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
  const intl = useIntl()

  return (
    <section className={styles.section}>
      <AccountHeader
        pageTitle={intl.formatMessage({ id: 'myaccount.userDetails.title' })}
      />
      <div data-fs-user-details-container>
        <AccountTable
          rows={[
            {
              heading: intl.formatMessage({ id: 'myaccount.userDetails.name' }),
              data: name ? name : '–',
            },
            {
              heading: intl.formatMessage({
                id: 'myaccount.userDetails.email',
              }),
              data: email,
            },
            {
              heading: intl.formatMessage({ id: 'myaccount.userDetails.role' }),
              data: role.map((r) => (
                <span key={r} data-fs-user-details-row-value>
                  <Tag>{r}</Tag>
                </span>
              )),
            },
            {
              heading: intl.formatMessage({
                id: 'myaccount.userDetails.orgUnit',
              }),
              data: orgUnit,
            },
          ]}
        />
      </div>
    </section>
  )
}
