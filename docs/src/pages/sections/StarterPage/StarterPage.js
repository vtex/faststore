import React from 'react'
import styles from './StarterPage.module.css'
import StarterComponent from '../../../components/StarterComponent/StarterComponent'
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const StarterPage = () => {
  const { siteConfig } = useDocusaurusContext();
  const starter = JSON.parse(JSON.stringify(siteConfig.customFields.starters));

  return (
    <div className={styles.StarterPage}>
        <div className={styles.StarterHeader}>
            <h1>Starter Library</h1>
            <div className={styles.Subtitle}>Check our starters to quickly get up and running your next FastStore website.</div>
            <p>
            Ranging from minimal to complex implementations, FastStore Starters are templates developers can use to create new ecommerce experiences straightaway.  
          </p>
        </div>
        <div className={styles.StarterContent}>
          <h2>Gatsby</h2>
          <div className={styles.StarterLib}>
          {starter.map(({name, imgPath, url}) => (
            <StarterComponent name={name} imgPath={imgPath} url={url}/>
          ))}
          </div>
        </div>
      </div>
  )
}

export default StarterPage
