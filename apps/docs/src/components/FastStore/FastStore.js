import React from 'react'
import ViewAll from '../ViewAll/ViewAll'
import ImageSwitcher from '../ImageSwitcher/ImageSwitcher'
import Link from '@docusaurus/Link'
import Cover from '/img/cover.png'
import CoverDark from '/img/coverDark.png'

function FastStore() {
  return (
    <div className="container my-16 px-4">
      <div className="flex justify-between flex-col sm:flex-row">
        <div className="my-auto md:pr-24">
          <h2 className="text-5xl text-fontSecondary leading-tight font-VTEXMedium">
            The fullstack toolkit for
            <span className="text-rebelPink"> high-performance stores</span>
          </h2>
          <p className="text-base text-details my-6">
            FastStore is the open-source toolkit to create tailor-made
            storefronts. Bring your preferred CMS, CSS framework, or deployment
            platform to deliver blazing-fast storefronts that convert!
          </p>
          <div>
            <div>
              <Link
                to="/docs"
                className="hover:text-white hover:no-underline hover:brightness-110 py-2 px-3 rounded-full bg-rebelPink text-white font-VTEXMedium text-sm  mr-3"
              >
                EXPLORE DOCS
              </Link>
              <ViewAll
                linkTo="https://vtexfaststore.com/"
                message="View live store"
              />
            </div>
          </div>
          <Link
            to="beta/about"
            className="block mt-6 p-4 rounded-lg bg-code hover:no-underline hover:bg-tagHighlight"
          >
              <h2 className="text-lg text-fontSecondary font-VTEXMedium">
                Join VTEX + FastStore Beta program
              </h2>
              <p className="text-base text-fontSecondary">
                If you are a VTEX client, join the Closed Beta to go live with
                the full VTEX solution for building lightning-fast shopping
                experiences.
              </p>
          </Link>
        </div>

        <ImageSwitcher
          lightImageSrc={Cover}
          darkImageSrc={CoverDark}
          classes="md:block md:w-2/5 md:object-contain hidden"
        />
      </div>
    </div>
  )
}

export default FastStore
