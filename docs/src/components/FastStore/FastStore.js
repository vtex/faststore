import React from 'react'
import styles from './FastStore.module.css'
import ViewAll from '../ViewAll/ViewAll'
import FeatureCard from '../FeatureCard/FeatureCard'
import SearchBar from '@theme/SearchBar'
import ImageSwitcher from '../ImageSwitcher/ImageSwitcher'
import Link from '@docusaurus/Link'

function FastStore() {
  return (
    <div className="text-text border-b border-border pb-10">
      <div className="flex justify-between mb-8 flex-col sm:flex-row">
        <div className="w-full flex justify-between items-center sm:w-3/5">
          <div>
            <h1 className="tracking-wider uppercase text-sm text-rebelPink font-VTEXMedium">FASTSTORE</h1>
            <h2 className="text-5xl text-fontSecondary leading-tight">
              The fullstack toolkit for building <strong>high-performance</strong> stores.
            </h2>
            <div className="mb-8 mt-6">
              <div >
                <Link
                  to="/tutorials"
                  className="hover:text-white hover:no-underline hover:brightness-105 py-2 px-3 rounded text-white font-VTEXMedium text-sm bg-secondary inline-block mr-3"
                >
                  GET STARTED
                </Link>

                <Link
                  to="/docs"
                  className="hover:no-underline hover:brightness-110 py-2 px-3 rounded text-rebelPink font-VTEXMedium text-sm inline-block mr-3 border border-rebelPink"
                >
                  SEE DOCS
                </Link>
              </div>
              <ViewAll
                linkTo="https://vtexfaststore.com/"
                message="View live store"
              />
            </div>

            <div className="flex flex-wrap justify-between">
              <FeatureCard
                title="Use the technologies you already know"
                description="Explore your creativity building unique digital commerce storefronts with React."
              >
               
              </FeatureCard>

              <FeatureCard
                title="Analyze your data with Google Analytics 4"
                description="Understand your website traffic with Google Analytics 4 and make informed decisions."
              >
               
              </FeatureCard>
            </div>
          </div>
        </div>
        <ImageSwitcher 
          lightImageSrc="https://vtexhelp.vtexassets.com/assets/docs/src/performance___22b8f305649a26c629b59b51b7906409.png"
          darkImageSrc="https://vtexhelp.vtexassets.com/assets/docs/src/performanceDark___72750ceb0ac806835ea961a31677ab0f.png"
          classes='block sm:w-1/3 sm:object-contain w-11/12'/>
      </div>
      <div className={styles.search}>
        <SearchBar />
      </div>
      <blockquote className="hidden sm:block">
        <p>
          🗞️ Wanna stay up-to-date with the latest news from FastStore? Check
          our <a href="/releases/tags/faststore">Release Notes!</a>
        </p>
      </blockquote>
    </div>
  )
}

export default FastStore
