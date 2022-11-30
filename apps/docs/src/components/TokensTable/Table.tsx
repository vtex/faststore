import React, { useCallback, useEffect } from 'react'
import { useTable, useGlobalFilter, Column, Row, IdType } from 'react-table'
import { matchSorter } from 'match-sorter'
import styles from './Table.module.css'
import CopyButton from '@theme/CodeBlock/CopyButton'

interface TableProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  filters: string[]
  filter: string
}

export function Table<T extends { id: string }>({
  columns,
  data,
  filters,
  filter,
}: TableProps<T>): React.ReactElement {
  const ourGlobalFilterFunction = useCallback(
    (rows: Row<T>[], ids: IdType<T>[], query: string) => {
      return matchSorter(rows, query, {
        keys: filters.map((columnName) => `values.${columnName}`),
      })
    },
    [filters]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable<T>(
    {
      columns,
      data,
      globalFilter: ourGlobalFilterFunction,
    },
    useGlobalFilter
  )

  useEffect(() => {
    setGlobalFilter(filter)
  }, [filter, setGlobalFilter])

  return (
    <table {...getTableProps()} className={styles.TokenTable}>
      <thead>
        <tr>
          {headers.map((column: any, index) => (
            <th key={index} {...column.getHeaderProps()}>
              {column.render('Header')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: any, i: any) => {
          prepareRow(row)
          return (
            <tr key={i} {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                if (cell.column.id == 'example') {
                  return (
                    <td key={i}>
                      <div
                        style={JSON.parse(cell.value)}
                        className="rounded-full w-8 h-8 border"
                      />
                    </td>
                  )
                } else if (cell.column.id !== 'type') {
                  return (
                    <td key={i} {...cell.getCellProps()}>
                      <CopyButton
                        code={cell.value}
                        className={`flex items-center p-2 rounded hover:text-rebelPink float-left`}
                      />
                      <code>{cell.render('Cell')}</code>
                    </td>
                  )
                } else {
                  return (
                    <td key={i} {...cell.getCellProps()}>
                      <code>{cell.render('Cell')}</code>
                    </td>
                  )
                }
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
