import React from 'react'
import styles from './OverviewSection.module.css'

const OverviewSectionRow = ({children}) => {
  return (
    <div className={styles.overviewSectionRow}>
      {children}
    </div>
  )
}

export default OverviewSectionRow
