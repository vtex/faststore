import React, { CSSProperties } from 'react'
import styles from './overview-section.module.css'

type Direction = 'column' | 'row'

export type OverviewSectionProps = {
  dark?: boolean
  direction?: Direction
  bigGap?: boolean
  containerStyle?: CSSProperties
}

const OverviewSection = ({
  children,
  dark,
  direction,
  containerStyle,
  bigGap,
  ...otherProps
}) => {
  return (
    <div
      className={styles.overviewSection}
      data-doc-overview-section
      data-doc-overview-dark={dark}
      data-doc-overview-direction={direction}
      data-doc-overview-big-gap={bigGap}
      style={containerStyle}
      {...otherProps}
    >
      {children}
    </div>
  )
}

export default OverviewSection
