import React from 'react'
import styles from './FastStore.module.css'
import ViewAll from '../ViewAll/ViewAll'
import FeatureCard from '../FeatureCard/FeatureCard'
import lightImg from '/img/performance.png'
import darkImg from '/img/performanceDark.png'
import SearchBar from '@theme/SearchBar'
import ImageSwitcher from '../ImageSwitcher/ImageSwitcher';

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
                title="Use the technologies you already know"
                description="Explore your creativity building unique digital commerce storefronts with React."
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><title>code</title><g stroke-linecap="square" stroke-width="2" fill="none" stroke="var(--ifm-font-color-secondary)" stroke-linejoin="miter" class="nc-icon-wrapper" stroke-miterlimit="10"><polyline points="12,16 4,24 12,32 "></polyline> <polyline points="36,16 44,24 36,32 "></polyline> <line x1="20" y1="40" x2="28" y2="8" stroke="#f71963"></line></g></svg>
              </FeatureCard>

              <FeatureCard
                title="Analyze your data with Google Analytics 4"
                description="Understand your website traffic with Google Analytics 4 and make informed decisions."
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><title>ranking</title><g stroke-linecap="square" stroke-width="2" fill="none" stroke="var(--ifm-font-color-secondary)" stroke-linejoin="miter" class="nc-icon-wrapper" stroke-miterlimit="10"><polyline points="11 26 17 14 31 24 45 6"></polyline> <line x1="3" y1="42" x2="8" y2="32"></line> <polyline points="3 26 11 26 31 37 45 28" stroke="#f71963"></polyline></g></svg>
              </FeatureCard>
            </div>
          </div>
        </div>
        <ImageSwitcher 
          lightImageSrc={lightImg}
          darkImageSrc={darkImg}
          classes='block sm:w-1/3 sm:object-contain w-11/12'/>
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
    </div >
  )
}

export default FastStore
