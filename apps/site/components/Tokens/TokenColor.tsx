import styles from './token-colors.module.css'

export type TokenColorProps = {
  token: string
  value: string
}

const TokenColor = ({ token, value }: TokenColorProps) => {
  return (
    <li className={styles.tokenColor}>
      <div style={{ backgroundColor: value }}></div>
      <p>{token}</p>
      <code>{value}</code>
    </li>
  )
}

export default TokenColor
