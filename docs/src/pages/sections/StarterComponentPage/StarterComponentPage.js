import React from 'react'
import styles from './StarterComponentPage.module.css'
import Link from '@docusaurus/Link'

const StarterComponentPage = ({ data = {} }) => {
  return (
    <>
    <div className={styles.BackNavigation}><Link href="/starters"><i className="fas fa-long-arrow-alt-left"></i> Back</Link></div>
    <div className={styles.StarterCard}>
      <div className={styles.CardInfo}>
        <h1>{data.name}</h1>
        <p className="text-primary">by {data.owner}</p>
        <p className={styles.StarterCardDescription}>{data.description}</p>
        <div className={styles.Features}>
          <p>Features:</p>
          <ul>
          {data.features?.map((feature) => (
              <li>{feature}</li>
          ))}
          </ul>
        </div>
        <p className={styles.Price}>{data.price}</p>
        <div className={styles.Buttons}>
          <Link className={styles.ViewSource} href={data.gitHubURL}>
            <i className="fab fa-github"></i> View source
          </Link>
          <Link className={styles.VisitDemo} href={data.demoURL}>
            Visit demo
          </Link>
        </div>
      </div>
        <img className={styles.CardImage} src={data.img}></img>
    </div>
    </>
  )
}

export default StarterComponentPage
