import React from 'react'
import styles from './SectionImage.module.css'
import ViewAll from '../ViewAll/ViewAll'

function SectionImage({ tag, title, description, linkTo, message, img }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionContent}>
        <div>
          <p className={styles.contentTag}>{tag}</p>
          <h3>{title}</h3>
          <p className={styles.contentDescription}>{description}</p>
          <ViewAll 
          message={message} 
          linkTo={linkTo}/>
        </div>
      </div>
      <img src={img} />
    </div>
  )
}

export default SectionImage
