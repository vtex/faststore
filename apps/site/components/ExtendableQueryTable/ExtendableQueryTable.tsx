import { PropsWithChildren } from 'react'

const ExtendableQueryTable = ({ children }: PropsWithChildren) => {
  return (
    <table className="nx-simple-table">
      <thead>
        <tr>
          <th>Fragment</th>
          <th>Side</th>
          <th>Query operation</th>
          <th>Page</th>
          <th>Where is used</th>
          <th>Return</th>
          <th>Parameters</th>
        </tr>
      </thead>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  )
}

export default ExtendableQueryTable
