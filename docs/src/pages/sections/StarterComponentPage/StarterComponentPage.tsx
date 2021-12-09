import React from 'react'
import styles from './StarterComponentPage.module.css'
import Link from '@docusaurus/Link'

const data = {
  name: 'Base Store',
  owner: 'VTEX',
  description:
    'Kickoff your store with this boilerplate. This starter ships with the main FastStore configuration files you need to get up and running blazing fast.',
  features: [
    'Landing page',
    'Product page',
    'Intelligent search',
    'Filters for categories',
    'Optimistic shopping cart',
    'CSS modules abd Tailwind for straight-forward customization',
    'Google Analytics',
  ],
  demoURL: 'https://base.vtex.app/',
  gitHubURL: 'https://github.com/vtex-sites/base.store',
  price: 'Free',
  img: '/img/base-starter.png',
}

const StarterComponentPage = () => {
  return (
    <>
    <div className={styles.BackNavigation}><Link href="/starters"><i className="fas fa-long-arrow-alt-left"></i> Back</Link></div>
    <div className={styles.StarterCard}>
      <div className={styles.CardInfo}>
        <h1>{data.name}</h1>
        <p className="text-rebelPink">by {data.owner}</p>
        <p className={styles.StarterCardDescription}>{data.description}</p>
        <div className={styles.Features}>
          <p>Features:</p>
          <ul>
          {data.features.map((feature) => (
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
