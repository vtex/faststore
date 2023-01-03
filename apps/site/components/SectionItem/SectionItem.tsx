import React from 'react'
import styles from './sectionItem.module.css'

const SectionItem = ({children}) => {
  return (
    <article className={styles.sectionItem}>
      {children}
    </article>
  )
}

export default SectionItem
