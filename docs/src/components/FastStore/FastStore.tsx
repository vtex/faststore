import React from 'react'
import styles from './FastStore.module.css'
import ViewAll from '../ViewAll/ViewAll'
import FeatureCard from '../FeatureCard/FeatureCard'
import fastImg from '/img/performance.png'
import perfImg from '/img/performance-icon.png'
import gaImg from '/img/analytics-icon.png'
import devImg from '/img/code.png'
import SearchBar from '@theme/SearchBar'

function FastStore() {
  return (
    <div className={styles.faststore}>
      <div className={styles.faststoreSection}>
        <div className={styles.faststoreContent}>
          <div>
            <h1>FastStore</h1>
            <h2>The fullstack toolkit for building high-performance stores.</h2>
            <ViewAll
              linkTo="https://storecomponents.vtex.app/"
              message="View demo"
            />

            <div className={styles.features}>
              <FeatureCard
                img={devImg}
                title="Use the technologies you already know"
                description="Explore your creativity building unique digital commerce storefronts with React."
              />

              <FeatureCard
                img={gaImg}
                title="Analyze your data with Google Analytics 4"
                description="Understand your website traffic with Google Analytics 4 and make informed decisions."
              />
            </div>
          </div>
        </div>
        <img src={fastImg} />
      </div>
      <div className={styles.search}>
        <SearchBar />
      </div>
      <blockquote >
        <p>
          🗞️ Wanna stay up-to-date with the latest news from FastStore? Check
          our <a href="/releases/tags/faststore">Release Notes!</a>
        </p>
      </blockquote>
    </div>
  )
}

export default FastStore
