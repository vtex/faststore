import React from 'react'
import styles from './OverviewSection.module.css'

type Direction = 'column' | 'row'

export type OverviewSectionProps = {
  dark?: boolean
  direction?: Direction
}

const OverviewSection = ({ children, dark, direction }) => {
  return (
    <div
      className={styles.overviewSection}
      data-doc-overview-dark={dark}
      data-doc-overview-direction={direction}
    >
      {children}
    </div>
  )
}

export default OverviewSection
