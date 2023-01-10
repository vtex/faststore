import React from 'react'
import type { PropsWithChildren } from 'react'
import styles from './SectionItem.module.css'

export type SectionListProps = {
  grid?: 'row' | 'column'
}

const SectionList = ({
  children,
  grid = 'row',
}: PropsWithChildren<SectionListProps>) => {
  return (
    <section className={styles.sectionList}>
      <ul data-doc-section-grid={grid}>
        {children}
      </ul>
    </section>
  )
}

export default SectionList
