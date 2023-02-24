import React, { PropsWithChildren } from 'react'
import styles from './icon.module.css'

const IconList = ({ children }: PropsWithChildren) => {
  return <ul className={styles.iconList}>{children}</ul>
}

export default IconList
