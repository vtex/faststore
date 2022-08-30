import React from 'react'
import styles from './CardGrid.module.css'

const CardGrid = ({ children, icon = false }) => (
  <div className={icon ? styles.iconGrid : styles.cardGrid}>{children}</div>
)

export default CardGrid