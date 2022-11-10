import React, { useMemo, useState } from 'react'
import { Table } from './Table'

import styles from './Table.module.css'

export default function TokensTable(data: string) {
  data = Object.values(data)[0]
  const columns = useMemo(() => {
    const cols = [
      {
        Header: 'Token',
        accessor: 'token',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Default Value',
        accessor: 'defaultValue',
      },
    ]
    if (JSON.parse(data).some((d) => (d.example))) {
      cols.push({
        Header: 'Example',
        accessor: 'example',
      })
    }
    return cols
  }, [])

  const [filter, setFilter] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setFilter(value)
  }

  return (
    <>
      {JSON.parse(data).length > 5 && (
        <label className={styles.SearchInput}>
          <input
            value={filter}
            onChange={handleInputChange}
            placeholder="Search"
          />
        </label>
      )}
      <Table
        columns={columns}
        data={JSON.parse(data)}
        filters={['token', 'type', 'defaultValue']}
        filter={filter}
      />
    </>
  )
}
