import React from 'react'
import styles from './OverviewSection.module.css'

const OverviewSectionItem = ({children}) => {
  return (
    <div className={styles.OverviewSectionItem}>
      {children}
    </div>
  )
}

export default OverviewSectionItem
