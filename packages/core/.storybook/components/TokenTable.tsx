import React, { ReactNode } from 'react'
import { Table } from '@storybook/components'

type TokenTableProps = {
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
    <Table
      style={{
        width: '100%',
      }}
      className="sbdocs sbdocs-table"
    >
      <thead>
        <tr>
          <th>{title}</th>
          <th>{description}</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}

export default TokenTable
