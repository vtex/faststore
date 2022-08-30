import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import tinytime from 'tinytime'
import Link from '@docusaurus/Link'

const LatestUpdates = () => {
  const formatDate = tinytime('{MM} {DD}, {YYYY}').render
  const { siteConfig } = useDocusaurusContext()
  const release = JSON.parse(JSON.stringify(siteConfig.customFields.events))

  return (
    <section>
      <h2 className="mb-6">
        Release Notes
      </h2>
      <div className="h-96 overflow-y-auto mb-10 sm:mb-0">
        {release.map((item, i) => (
          <>
            <time className='text-details text-sm'>
              {formatDate(new Date(item.fileName.slice(0, 10)))}
            </time>
            <Link
              className="hover:no-underline group"
              to={`/releases/${item.fileName
                .split('-')
                .slice(0, 3)
                .join('/')}/${item.fileName.split('-').slice(3).join('-')}`}
            >
              <div className='border-l pl-4 pb-3 ml-5'>
                <h4 className='pt-3 text-fontSecondary font-VTEXTrust  group-hover:text-rebelPink leading-8'>{item.title}</h4>
                <p className="col-span-3 text-details leading-7">{item.description}</p>
              </div>
            </Link></>
        ))}
      </div>
    </section>
  )
}

export default LatestUpdates