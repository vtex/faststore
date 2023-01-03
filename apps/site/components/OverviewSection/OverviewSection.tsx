import React from 'react'
import styles from './OverviewSection.module.css'

export type OverviewSectionProps = {
  dark?: boolean
}

const OverviewSection = ({children, dark}) => {
  return (
    <div className={styles.overviewSection} data-doc-overview-dark={dark}>
      {children}
    </div>
  )
}

export default OverviewSection
