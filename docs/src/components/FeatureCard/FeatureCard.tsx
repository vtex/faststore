import React from 'react'
import styles from './FeatureCard.module.css'

function FeatureCard({ title, description, img }) {
  return (
    <div className={styles.featureCard}>
      <img src={img} />
      <div className={styles.communityText}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default FeatureCard
