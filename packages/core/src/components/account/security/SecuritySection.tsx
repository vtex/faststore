import { useState } from 'react'
import { Button } from '@faststore/ui'

import { SecurityDrawer } from './SecurityDrawer'
import styles from './styles.module.scss'

export const SecuritySection = ({ userEmail }: { userEmail: string }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <>
      {isDrawerOpen && (
        <SecurityDrawer
          userEmail={userEmail}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}

      <section data-fs-securiry-section className={styles.section}>
        <header data-fs-security-header>
          <h1 data-fs-security-title>Security</h1>
        </header>

        <div data-fs-security-container>
          <table data-fs-security-table>
            <tbody data-fs-security-table-body>
              <tr data-fs-security-table-row>
                <th data-fs-security-table-heading>Password</th>
                <td data-fs-security-table-data>
                  <span data-fs-security-table-data-text>••••••••••</span>
                  <Button
                    variant="tertiary"
                    data-fs-security-table-action-button
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    Reset password
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
