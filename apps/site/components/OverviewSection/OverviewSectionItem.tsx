import React from 'react'
import styles from './OverviewSection.module.css'

const OverviewSectionItem = ({children}) => {
  return (
    <article className={styles.overviewSectionItem}>
      {children}
    </article>
  )
}

export default OverviewSectionItem
