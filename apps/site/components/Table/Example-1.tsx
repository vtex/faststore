import {
  Icon,
  Price,
  Ruler,
  ShoppingCart,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@faststore/ui'
import React from 'react'

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
]

const sizes = [
  {
    type: 'Width',
    value: '1.5m',
  },
  {
    type: 'Height',
    value: '1.5m',
  },
  {
    type: 'Dimensions',
    value: '7 x 3 x 9 in',
  },
]

const priceFormatter = (value: number) => <span>{value}</span>

export default function TableExample1() {
  return (
    <div className="overviewSectionColumn">
      <div className="overviewSection">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell scope="col" variant="header" align="left">
                Colored + Icon
              </TableCell>
              <TableCell scope="col" variant="header" align="right">
                Values
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sizes.map((size) => (
              <TableRow key={size.type}>
                <TableCell variant="header" align="left">
                  <Icon component={<Ruler />} />
                  {size.type}
                </TableCell>
                <TableCell align="right">{size.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table variant="bordered">
          <TableHead>
            <TableRow>
              <TableCell scope="col" variant="header" align="left">
                Bordered + Icon
              </TableCell>
              <TableCell scope="col" variant="header" align="right">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option) => (
              <TableRow key={option.numberOfInstallments}>
                <TableCell variant="header" align="left">
                  <Icon component={<ShoppingCart />} />
                  {option.numberOfInstallments}x
                </TableCell>
                <TableCell align="right">
                  <Price formatter={priceFormatter} value={option.total} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="overviewSection">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell scope="col" variant="header" align="left">
                Colored
              </TableCell>
              <TableCell scope="col" variant="header" align="right">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option) => (
              <TableRow key={option.numberOfInstallments}>
                <TableCell variant="header" align="left">
                  {option.numberOfInstallments}x
                </TableCell>
                <TableCell align="right">
                  <Price formatter={priceFormatter} value={option.total} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table variant="bordered">
          <TableHead>
            <TableRow>
              <TableCell scope="col" variant="header" align="left">
                Bordered
              </TableCell>
              <TableCell scope="col" variant="header" align="right">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option) => (
              <TableRow key={option.numberOfInstallments}>
                <TableCell variant="header" align="left">
                  {option.numberOfInstallments}x
                </TableCell>
                <TableCell align="right">
                  <Price formatter={priceFormatter} value={option.total} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
