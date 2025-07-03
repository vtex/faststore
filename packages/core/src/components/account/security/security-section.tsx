import { Button } from '@faststore/ui'

import styles from './security.module.scss'

export const SecuritySection = () => {
  return (
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
                <span>••••••••••</span>
                <Button
                  variant="tertiary"
                  data-fs-security-table-action-button
                  onClick={() => {
                    console.log('Reset password action triggered')
                  }}
                >
                  Reset password
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
