import { useState } from 'react'
import { Button } from '@faststore/ui'
import { useIntl } from 'react-intl'

import AccountTable from '../components/MyAccountTable'
import AccountHeader from '../components/MyAccountHeader'

import { SecurityDrawer } from './SecurityDrawer'
import styles from './styles.module.scss'

type SecuritySectionProps = { userEmail: string; accountName?: string }

export const SecuritySection = ({
  userEmail,
  accountName,
}: SecuritySectionProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const intl = useIntl()

  return (
    <>
      {isDrawerOpen && (
        <SecurityDrawer
          userEmail={userEmail}
          accountName={accountName}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}

      <section data-fs-securiry-section className={styles.section}>
        <AccountHeader
          pageTitle={intl.formatMessage({ id: 'myaccount.security.title' })}
        />

        <div data-fs-security-container>
          <AccountTable
            rows={[
              {
                heading: intl.formatMessage({
                  id: 'myaccount.security.password',
                }),
                data: (
                  <>
                    <span data-fs-security-table-data-text>••••••••••</span>
                    <Button
                      variant="tertiary"
                      data-fs-security-table-action-button
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      {intl.formatMessage({
                        id: 'myaccount.security.resetPassword',
                      })}
                    </Button>
                  </>
                ),
              },
            ]}
          />
        </div>
      </section>
    </>
  )
}
