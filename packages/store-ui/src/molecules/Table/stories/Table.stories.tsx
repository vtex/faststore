import type { Story } from '@storybook/react'
import React from 'react'

// import type { ComponentArgTypes } from '../../../typings/utils'
import type { TableProps } from '../Table'
import TableComponent from '../Table'
// import TableFooter from '../TableFooter'
import TableHead from '../TableHead'
import TableRow from '../TableRow'
import TableBody from '../TableBody'
import TableCell from '../TableCell'
import mdx from './Table.mdx'

const TableTemplate: Story<TableProps> = () => (
  <TableComponent>
    <TableHead>
      <TableRow>
        <TableCell scope="col" variant="header">
          Name
        </TableCell>
        <TableCell scope="col" variant="header">
          Age
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>John</TableCell>
        <TableCell>25</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Carter</TableCell>
        <TableCell>25</TableCell>
      </TableRow>
    </TableBody>
  </TableComponent>
)

export const Table = TableTemplate.bind({})

// const argTypes: ComponentArgTypes<InstallmentsProps> = {
//   children: {
//     control: { type: 'text' },
//     defaultValue: 'Button',
//   },
// }

export default {
  title: 'Molecules/Table',
  // argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
