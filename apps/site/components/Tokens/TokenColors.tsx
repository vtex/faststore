import styles from './token-colors.module.css'

const TokenColors = ({ children }) => {
  return <ul className={styles.tokenColors}>{children}</ul>
}

export default TokenColors
