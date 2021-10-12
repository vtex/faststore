import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Table from './Table'
// import TableFooter from '../TableFooter'
import TableHead from './TableHead'
import TableRow from './TableRow'
import TableBody from './TableBody'
import TableCell from './TableCell'

// WAI-ARIA tests
// https://www.w3.org/WAI/tutorials/tables/
describe('Table WAI-ARIA Specifications', () => {
  describe('Tables with one header', () => {
    it('should have no violations on a table with header cells in the top row only', async () => {
      const { container } = render(
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="header">Name</TableCell>
              <TableCell variant="header">Age</TableCell>
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
        </Table>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations on a table with header cells in the first column only', async () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="header">Date</TableCell>
              <TableCell>12 February</TableCell>
              <TableCell>24 March</TableCell>
              <TableCell>14 April</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="header">Event</TableCell>
              <TableCell>Waltz with Strauss</TableCell>
              <TableCell>The Obelisks</TableCell>
              <TableCell>The What</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="header">Venue</TableCell>
              <TableCell>Main Hall</TableCell>
              <TableCell>West Wing</TableCell>
              <TableCell>Main Hall</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    // https://www.w3.org/WAI/WCAG21/Techniques/html/H63
    it('should have no violations on a table with ambiguous data, where scope should be used', async () => {
      const { container } = render(
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="header" scope="col">
                Last Name
              </TableCell>
              <TableCell variant="header" scope="col">
                First Name
              </TableCell>
              <TableCell variant="header" scope="col">
                City
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Phoenix</TableCell>
              <TableCell>Imari</TableCell>
              <TableCell>Henry</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Zeki</TableCell>
              <TableCell>Rome</TableCell>
              <TableCell>Min</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Apirka</TableCell>
              <TableCell>Kelly</TableCell>
              <TableCell>Brynn</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Tables with two headers', () => {
    it.todo(
      'should have no violations on a table with header cells in the top row and first column'
    )

    it.todo(
      'should have no violations on a table with an offset column of header cells'
    )
  })

  describe('Tables with irregular headers', () => {
    it.todo('should have no violations on a table with two tier headers')
    it.todo(
      'should have no violations on a table with headers spanning multiple rows or columns'
    )
  })

  describe('Tables with multi-level headers', () => {
    it.todo(
      'should have no violations on a table with multiple column headers in each column'
    )
  })
})
