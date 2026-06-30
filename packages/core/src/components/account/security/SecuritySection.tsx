import { useState } from 'react'
import { Button } from '@faststore/ui'

import AccountTable from '../components/Table'
import AccountHeader from '../components/Header'

import { SecurityDrawer } from './SecurityDrawer'
import {
  type SecuritySectionLabels,
  resolveSecurityLabels,
} from './securityLabels'
import styles from './styles.module.scss'

type SecuritySectionProps = {
  userEmail: string
  accountName?: string
  labels?: SecuritySectionLabels
}

export const SecuritySection = ({
  userEmail,
  accountName,
  labels: labelsProp,
}: SecuritySectionProps) => {
  const labels = resolveSecurityLabels(labelsProp)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <>
      {isDrawerOpen && (
        <SecurityDrawer
          userEmail={userEmail}
          accountName={accountName}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          labels={labels}
        />
      )}

      <section data-fs-securiry-section className={styles.section}>
        <AccountHeader pageTitle={labels.pageTitle} />

        <div data-fs-security-container>
          <AccountTable
            rows={[
              {
                heading: labels.passwordLabel,
                data: (
                  <>
                    <span data-fs-security-table-data-text>••••••••••</span>
                    <Button
                      variant="tertiary"
                      data-fs-security-table-action-button
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      {labels.resetPasswordLabel}
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
