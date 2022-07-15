import React from 'react'
import Link from '@docusaurus/Link'
import Cover from '/img/newperf.png'

function Hero() {
  return (
    <div className='bg-whiteIce mb-24'>
      <div className="mx-auto p-4 w-full lg:max-w-6xl lg:py-16">
        <div className="flex justify-between flex-col md:flex-row">
          <div className="my-auto md:pr-24">
            <h1 className='font-VTEXTrust text-sm text-details'>FastStore</h1>
            <h2 className="text-[52px] text-fontSecondary font-VTEXTrust leading-tight">
              The fullstack toolkit for high-performance stores
            </h2>
            <p className="text-base text-details my-6 leading-7">
            In the ecommerce world, speed matters. That's why we've built FastStore: an open-source toolkit to create blazing-fast storefronts that convert.
            </p>
            <div>
              <div>
                <Link
                  to="https://www.vtexfaststore.com/"
                  className="button-primary"
                >
                  VIEW LIVE DEMO
                </Link>
                <Link
                  to="https://www.vtexfaststore.com/"
                  className="button-tertiary">
                  Join the waiting list
                </Link>
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
