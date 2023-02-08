import styles from './TokenColors.module.css'

const TokenColors = ({ children }) => {
  return <ul className={styles.tokenColors}>{children}</ul>
}

export default TokenColors
