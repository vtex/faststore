import React, { ReactNode } from 'react'
import { Code } from '@storybook/components'

type TokenRowProps = {
  token: string
  value: string
  isColor?: boolean
  globalValue?: string
}

const TokenRow = ({
  token,
  value,
  globalValue,
  isColor = false,
}: TokenRowProps) => {
  return (
    <tr>
      <td>
        <Code>{token}</Code>
      </td>
      <td>
        {isColor && (
          <div style={{ backgroundColor: globalValue ? globalValue : value }} />
        )}
        <Code>{value}</Code>
      </td>
    </tr>
  )
}

export default TokenRow
