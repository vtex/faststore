import type { ReactNode } from 'react'
import styles from './token-table.module.css'

export type TokenTableProps = {
  title?: string
  description?: string
  children: ReactNode
}

const TokenTable = ({
  title = 'Local token',
  description = 'Default value/Global token linked',
  children,
}: TokenTableProps) => {
  return (
    <table
      style={{
        width: '100%',
      }}
      className={styles.tokenTable}
    >
      <thead>
        <tr>
          <th>{title}</th>
          <th>{description}</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export default TokenTable
