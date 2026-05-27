interface TableProps {
  rows?: Array<{
    heading: string
    data: React.ReactNode | string
  }>
}

function Table({ rows, ...props }: TableProps) {
  return (
    <table data-fs-account-table {...props}>
      <tbody data-fs-account-table-body>
        {rows?.map((row, idx) => (
          <tr data-fs-account-table-row key={idx}>
            <th data-fs-account-table-heading>{row.heading}</th>
            <td data-fs-account-table-data>{row.data}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
