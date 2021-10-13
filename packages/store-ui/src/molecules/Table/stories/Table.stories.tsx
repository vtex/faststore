import type { Story } from '@storybook/react'
import React from 'react'

import type { TableProps } from '../Table'
import TableComponent from '../Table'
import TableHead from '../TableHead'
import TableRow from '../TableRow'
import TableBody from '../TableBody'
import TableCell from '../TableCell'
import Price from '../../../atoms/Price'
import mdx from './Table.mdx'

function priceFormatter(price: number) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

  return formattedPrice
}

const options = [
  {
    numberOfInstallments: 1,
    monthlyPayment: 200,
    total: 200,
  },
  {
    numberOfInstallments: 2,
    monthlyPayment: 100,
    total: 200,
  },
  {
    numberOfInstallments: 3,
    monthlyPayment: 68,
    total: 204,
  },
  {
    numberOfInstallments: 4,
    monthlyPayment: 52,
    total: 208,
  },
  {
    numberOfInstallments: 5,
    monthlyPayment: 43,
    total: 215,
  },
]

const TableTemplate: Story<TableProps> = () => (
  <TableComponent>
    <TableHead>
      <TableRow>
        <TableCell scope="col" variant="header">
          Installments
        </TableCell>
        <TableCell scope="col" variant="header">
          Amount
        </TableCell>
        <TableCell scope="col" variant="header">
          Total
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {options.map((option) => (
        <TableRow key={option.numberOfInstallments}>
          <TableCell>{option.numberOfInstallments}x</TableCell>
          <TableCell>
            <Price formatter={priceFormatter} value={option.monthlyPayment} />
          </TableCell>
          <TableCell>
            <Price formatter={priceFormatter} value={option.total} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </TableComponent>
)

export const Table = TableTemplate.bind({})

export default {
  title: 'Molecules/Table',
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
