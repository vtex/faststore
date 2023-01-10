export type TokenRowProps = {
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
        <code>{token}</code>
      </td>
      <td>
        {isColor && (
          <div style={{ backgroundColor: globalValue ? globalValue : value }} />
        )}
        <code>{value}</code>
      </td>
    </tr>
  )
}

export default TokenRow
