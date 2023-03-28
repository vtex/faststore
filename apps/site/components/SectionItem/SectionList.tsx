import type { PropsWithChildren } from 'react'
import styles from './section-item.module.css'

export type SectionListProps = {
  grid?: 'row' | 'column'
  columns?: 3 | 2
  classes?: string
}

const SectionList = ({
  children,
  grid = 'row',
  columns = 3,
  classes,
  ...otherProps
}: PropsWithChildren<SectionListProps>) => {
  const scopedClasses =
    classes?.split(' ').map((klass) => styles[klass] ?? '') ?? []
  const stylizedClasses = scopedClasses.reduce(
    (acc, klass) => `${acc} ${klass}`,
    ''
  )

  return (
    <section
      className={`${styles.sectionList} ${stylizedClasses}`}
      {...otherProps}
    >
      <ul data-doc-section-grid={grid} data-doc-section-grid-columns={columns}>
        {children}
      </ul>
    </section>
  )
}

export default SectionList
