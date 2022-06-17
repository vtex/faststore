import React from 'react'
import styles from './InfoCard.module.css'

const InfoCard = ({ children }) => (
  <div className={styles.homeGrid}>{children}</div>
)

export default InfoCard
