import type { ReactNode } from 'react'
import styles from './icon.module.css'

export type IconProps = {
  icon: ReactNode
  name: string
}

const Icon = ({ icon, name }: IconProps) => {
  return (
    <li className={styles.icon}>
      <div className={styles.iconItem}>{icon}</div>
      <p>{name}</p>
    </li>
  )
}

export default Icon
