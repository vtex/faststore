import React from 'react'
import StarterComponent from '../../../components/StarterComponent/StarterComponent'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Link from '@docusaurus/Link'

const StarterPage = () => {
  const { siteConfig } = useDocusaurusContext()
  const starter = JSON.parse(JSON.stringify(siteConfig.customFields.starters))
  return (
    <div>
      <div className="pt-20 py-16 text-center flex justify-center flex-col bg-code">
        <p className="uppercase text-sm text-fontSecondary font-bold">Quickly get your next FastStore website up and running</p>
        <h1 className="text-5xl text-fontSecondary font-VTEXTrust pt-5">FastStore Starter Library</h1>
        <p className='text-lg pt-3 text-details px-5 sm:w-2/5 pb-5 inline-block mx-auto'>Ranging from minimal to complex implementations, Starters are templates developers can use to create new ecommerce experiences straightaway.</p>
        <Link className="hover:text-white mx-auto py-3 px-4 rounded text-white uppercase font-VTEXMedium text-sm bg-seriousBlack inline-block" href="/starters/submissions">Submit your starter</Link>
      </div>

      <div className="w-6/12 mx-auto py-16">
        <div className="flex flex-wrap justify-between pb-10">
          {starter.map((s) => (
            <StarterComponent starter={s}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StarterPage
