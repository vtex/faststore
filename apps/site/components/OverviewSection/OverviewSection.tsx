import React from 'react'
import styles from './OverviewSection.module.css'

const OverviewSection = ({children}) => {
  return (
    <div className={styles.overviewSection}>
      {children}
    </div>
  )
}

export default OverviewSection
