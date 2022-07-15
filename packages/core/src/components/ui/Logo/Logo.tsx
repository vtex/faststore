import styles from './logo.module.scss'

function Logo() {
  return (
    <span
      className={styles.fsLogo}
      data-fs-logo
      role="img"
      aria-label="BaseStore logo"
    />
  )
}

export default Logo
