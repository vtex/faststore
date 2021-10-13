import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Table from './Table'
import TableHead from './TableHead'
import TableRow from './TableRow'
import TableBody from './TableBody'
import TableCell from './TableCell'
import TableFooter from './TableFooter'

describe('Data attributes', () => {
  it('should render a simple table with all expected data-attributes', () => {
    const { getByTestId, queryAllByTestId } = render(
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
        <TableFooter>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    const table = getByTestId('store-table')

    expect(table).toHaveAttribute('data-store-table')

    const tableHead = getByTestId('store-table-head')

    expect(tableHead).toHaveAttribute('data-store-table-head')

    const tableBody = getByTestId('store-table-body')

    expect(tableBody).toHaveAttribute('data-store-table-body')

    const tableFooter = getByTestId('store-table-footer')

    expect(tableFooter).toHaveAttribute('data-store-table-footer')

    const tableRows = queryAllByTestId('store-table-row')

    expect(tableRows).toHaveLength(4)
    tableRows.forEach((row) => {
      expect(row).toHaveAttribute('data-store-table-row')
    })

    const tableCells = queryAllByTestId('store-table-cell')

    // Make sure 8 cells were rendered and all contain the
    // data-store-table-cell attribute.
    expect(tableCells).toHaveLength(8)
    tableCells.forEach((row) => {
      expect(row).toHaveAttribute('data-store-table-cell')
    })

    // Make sure that 2 header cells and 6 data cells were rendered, with their
    // corresponding attributes.
    expect(
      table.querySelectorAll('[data-store-table-cell=header]')
    ).toHaveLength(2)
    expect(table.querySelectorAll('[data-store-table-cell=data]')).toHaveLength(
      6
    )
  })
})

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
    it('should have no violations on a table with header cells in the top row and first column', async () => {
      const { container } = render(
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell variant="header" scope="col">
                Monday
              </TableCell>
              <TableCell variant="header" scope="col">
                Tuesday
              </TableCell>
              <TableCell variant="header" scope="col">
                Wednesday
              </TableCell>
              <TableCell variant="header" scope="col">
                Thursday
              </TableCell>
              <TableCell variant="header" scope="col">
                Friday
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell variant="header" scope="row">
                09:00 - 11:00
              </TableCell>
              <TableCell>Closed</TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Closed</TableCell>
              <TableCell>Closed</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="header" scope="row">
                11:00 - 13:00
              </TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Open</TableCell>
              <TableCell>Closed</TableCell>
              <TableCell>Closed</TableCell>
              <TableCell>Closed</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
