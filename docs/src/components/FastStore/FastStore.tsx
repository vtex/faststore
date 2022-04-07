import React from 'react'
import styles from './FastStore.module.css'
import ViewAll from '../ViewAll/ViewAll'
import FeatureCard from '../FeatureCard/FeatureCard'
import fastImg from '/img/performance.png'
import gaImg from '/img/analytics-icon.png'
import devImg from '/img/code.png'
import SearchBar from '@theme/SearchBar'

function FastStore() {
  return (
    <div className="text-text border-b pb-10">
      <div className="flex justify-between mb-12 flex-col sm:flex-row">
        <div className="w-full flex justify-between items-center pr-10 mt-20 sm:w-3/5">
          <div>
            <h1 className='leading-6 text-5xl font-VTEXMedium'>FastStore</h1>
            <h2 className='leading-tight text-4xl font-VTEXTrust'>The fullstack toolkit for building high-performance stores.</h2>
            <ViewAll
              linkTo="https://vtexfaststore.com/"
              message="View demo"
            />

            <div className="flex flex-wrap justify-between mt-5">
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
        <img className='block sm:w-1/3 sm:object-contain w-11/12' src={fastImg} />
      </div>
      <div className={styles.search}>
        <SearchBar />
      </div>
      <blockquote className='hidden sm:block m-5 mt-8' >
        <p>
          🗞️ Wanna stay up-to-date with the latest news from FastStore? Check
          our <a href="/releases/tags/faststore">Release Notes!</a>
        </p>
      </blockquote>
    </div>
  )
}

export default FastStore
