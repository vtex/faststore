import { useState } from 'react'
import { Button } from '@vtex/faststore-ui'

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
        <AccountHeader pageTitle="Security" />

        <div data-fs-security-container>
          <AccountTable
            rows={[
              {
                heading: 'Password',
                data: (
                  <>
                    <span data-fs-security-table-data-text>••••••••••</span>
                    <Button
                      variant="tertiary"
                      data-fs-security-table-action-button
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      Reset password
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
