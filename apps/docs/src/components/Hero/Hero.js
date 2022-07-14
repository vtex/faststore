import React from 'react'
import ViewAll from '../ViewAll/ViewAll'
import Link from '@docusaurus/Link'
import Cover from '/img/newperf.png'

function Hero() {
  return (
    <div className='bg-whiteIce mb-24'>
      <div className="mx-auto p-4 w-full lg:max-w-6xl lg:py-16">
        <div className="flex justify-between flex-col md:flex-row">
          <div className="my-auto md:pr-24">
            <h2 className="text-5xl text-fontSecondary font-VTEXTrust leading-tight">
              The fullstack toolkit for high-performance stores
            </h2>
            <p className="text-base text-details my-6 leading-7">
              FastStore is the open-source toolkit to create tailor-made
              storefronts. Bring your preferred CMS, CSS framework, or deployment
              platform to deliver blazing-fast storefronts that convert!
            </p>
            <div>
              <div>
                <Link
                  to="/docs"
                  className="md:my-4 inline-block hover:text-white hover:no-underline hover:brightness-110 py-4 px-6 rounded bg-rebelPink text-white font-VTEXMedium text-sm  mr-3"
                >
                  EXPLORE DOCS
                </Link>
                <ViewAll
                  linkTo="https://www.vtexfaststore.com/"
                  message="View live store"
                />
              </div>
            </div>
          </div>

          <img src={Cover} className="md:block md:w-2/5 md:object-contain my-10" />
        </div>
      </div>
    </div>
  )
}

export default Hero
