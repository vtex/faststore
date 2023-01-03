import React from 'react'
import styles from './OverviewSection.module.css'

const OverViewSectionRow = ({children}) => {
  return (
    <div className={styles.overviewSectionRow}>
      {children}
    </div>
  )
}

export default OverViewSectionRow
