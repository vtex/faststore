import React from 'react'
import styles from './OverviewSection.module.css'

type Direction = 'column' | 'row'

export type OverviewSectionProps = {
  dark?: boolean
  direction?: Direction
  bigGap?: boolean
}

const OverviewSection = ({ children, dark, direction, bigGap }) => {
  return (
    <div
      className={styles.overviewSection}
      data-doc-overview-dark={dark}
      data-doc-overview-direction={direction}
      data-doc-overview-big-gap={bigGap}
    >
      {children}
    </div>
  )
}

export default OverviewSection
