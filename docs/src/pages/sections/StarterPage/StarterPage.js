import React from 'react'
import styles from './StarterPage.module.css'
import StarterComponent from '../../../components/StarterComponent/StarterComponent'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Link from '@docusaurus/Link'

const StarterPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const starter = JSON.parse(JSON.stringify(siteConfig.customFields.starters))

  return (
    <div className={styles.StarterPage}>
      <div className={styles.header}>
        <p className="uppercase text-sm text-seriousBlack font-bold">Quickly get up and running your next FastStore website</p>
        <h1 className="text-5xl text-seriousBlack font-VTEXTrust pt-5 pb-0">FastStore Starter Library</h1>
        <p className='text-lg pt-3 text-details px-5 sm:w-2/5 pb-5 inline-block mx-auto'>Ranging from minimal to complex implementations, FastStore Starters are templates developers can use to create new ecommerce experiences straightaway.</p>
        <Link className="hover:text-white mx-auto py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-secondary inline-block" href="/starters/submissions">Submit your starter</Link>
      </div>

      <div className="w-6/12 mx-auto py-16">
      <h2 className='text-3xl font-VTEXTrust mb-8'>Gatsby</h2>
        <div className="flex flex-wrap justify-between pb-10">
          {starter.map(({ name, imgPath, url }) => (
            <StarterComponent name={name} imgPath={imgPath} url={url} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StarterPage
