import type { PropsWithChildren } from 'react'
import styles from './section-item.module.css'

export type SectionListProps = {
  grid?: 'row' | 'column'
  classes?: string
}

const SectionList = ({
  children,
  grid = 'row',
  classes,
}: PropsWithChildren<SectionListProps>) => {
  const scopedClasses =
    classes?.split(' ').map((klass) => styles[klass] ?? '') ?? []
  const stylizedClasses = scopedClasses.reduce(
    (acc, klass) => `${acc} ${klass}`,
    ''
  )

  return (
    <section className={`${styles.sectionList} ${stylizedClasses}`}>
      <ul data-doc-section-grid={grid}>{children}</ul>
    </section>
  )
}

export default SectionList
