import React from 'react'
import styles from './FeatureCard.module.css'

function FeatureCard({ title, description, children }) {
  return (
    <div className={styles.featureCard}>
      {children}
      <div className={styles.communityText}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default FeatureCard
