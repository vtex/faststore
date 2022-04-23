import React from 'react'
import styles from './StarterComponent.module.css'
import Link from '@docusaurus/Link'

const StarterComponent = ({ name, imgPath, url }) => {
  return (
    <>
      <Link className={styles.StarterCard} href={url}>
          <div>
            <img src={imgPath} />
          </div>
          <div className={styles.StarterInfo}>
            <h3>{name}</h3>
          </div>
      </Link>
    </>
  )
}

export default StarterComponent
