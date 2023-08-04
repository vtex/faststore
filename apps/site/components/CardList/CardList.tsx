import type { PropsWithChildren } from 'react'
import styles from './card-list.module.css'

export type CardListProps = {
  columns?: 4 | 3 | 2
  classes?: string
}

const CardList = ({
  children,
  columns = 3,
  classes,
  ...otherProps
}: PropsWithChildren<CardListProps>) => {
  return (
    <section className={styles.cardList} {...otherProps}>
      <ul data-doc-card-grid-columns={columns}>{children}</ul>
    </section>
  )
}

export default CardList
