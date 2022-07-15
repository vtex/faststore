import React from 'react'
import Layout from '@theme/Layout'
import Hero from '@site/src/components/Hero/Hero'
import PlaygroundPreview from '@site/src/components/Hero/PlaygroundPreview'
import Link from '@docusaurus/Link'

function Home() {
  return (
    <Layout title="FastStore Documentation">
      <main>
        <Hero />
        <div className="mx-auto px-4 w-full lg:max-w-6xl">
          <div className="grid lg:grid-cols-3 lg:gap-24 lg:my-6 my-14 gap-10">
            <div>
              <img src="/img/rocket.png" className="w-9" />
              <h3 className="my-4 font-VTEXRegular text-base lg:text-xl leading-8">
                Start fast with Starters optimized for performance
              </h3>
              <p className="text-[#4A596B] leading-7 text-sm lg:text-base">
                Quickly get your next FastStore website up and running with
                Starters optimized for performance.
              </p>
            </div>
            <div>
              <img src="/img/code.png" className="w-9" />
              <h3 className="my-4 font-VTEXRegular text-lg lg:text-xl leading-8">
                Build fast with the technologies you already know
              </h3>
              <p className="text-[#4A596B] leading-7 text-sm lg:text-base">
                Use your preferred tech stack and explore your creativity to
                build unique digital commerce storefronts.
              </p>
            </div>
            <div>
              <img src="/img/data-icon.png" className="w-9" />
              <h3 className="my-4 font-VTEXRegular text-lg lg:text-xl leading-8">
                Stay fast with Jamstack and Git workflows
              </h3>
              <p className="text-[#4A596B] leading-7 text-sm lg:text-base">
                Leverage the power of Jamstack to make data-driven decisions
                around performance and code quality.
              </p>
            </div>
          </div>

          <Link
            to="beta/about"
            className="mb-2 lg:mt-16 group flex lg:flex-row flex-col justify-between lg:items-center space-x-4 bg-whiteIce hover:no-underline content-center lg:p-8 py-4 gap-2 rounded"
          >
            <div>
              <h2 className="text-lg text-fontSecondary font-VTEXMedium">
                VTEX + FastStore Closed Beta
              </h2>
              <p className="text-base text-fontSecondary mr-40">
                To go live with the full VTEX solution for building
                lightning-fast shopping experiences, first check the
                requirements to join the Closed Beta program.
              </p>
            </div>
            <div>
              <button className="button-secondary block min-w-max group-hover:bg-[#000711]">
                LEARN MORE
              </button>
            </div>
          </Link>
          <i className="text-sm text-[#4A596B]">
            * Joining the Beta program is mandatory to benefit from VTEX
            support, WebOps and Headless CMS.
          </i>
        </div>

        <div className="mx-auto px-4 w-full lg:max-w-6xl my-24">
          <div className="grid auto-cols-fr lg:grid-flow-col">
            <div className="my-auto lg:mr-20">
              <h2 className="text-4xl font-VTEXTrust text-fontSecondary mb-8 leading-snug">
                Ecommerce-focused UI components
              </h2>
              <h3 className="font-VTEXTrust leading-8 text-xl mb-8">
                Optimized to convert
              </h3>
              <p className="text-[#4A596B] mb-8 leading-7">
                Use FastStore components to create modern storefronts that
                perform great everywhere.
              </p>
              <h3 className="font-VTEXTrust leading-8 text-xl mb-8">
                Frictionless development experience
              </h3>
              <p className="text-[#4A596B] mb-8 leading-7">
                FastStore components are React-based, open-source,
                accessibility-ready, and ecommerce-focused.
              </p>
              <Link to="reference/ui/components" className="button-secondary">
                EXPLORE OUR COMPONENTS
              </Link>
            </div>

            <PlaygroundPreview />
          </div>
        </div>

        <div className="mx-auto px-4 w-full my-16 lg:max-w-6xl">
          <div className="grid gap-20 auto-cols-fr lg:grid-flow-col">
            <div>
              <img src="img/apis.png" />
            </div>
            <div className="my-auto">
              <h2 className="text-4xl font-VTEXTrust text-fontSecondary mb-8 leading-snug">
                Flexible and extensible GraphQL schemas
              </h2>
              <h3 className="font-VTEXTrust leading-8 text-xl mb-8">
                Deliver seamless experiences everywhere
              </h3>
              <p className="text-[#4A596B] mb-8 leading-7">
                A Backend For Frontend (BFF) layer for you to perform operations
                more effectively at the server and overcome shortcomings from
                REST APIs.
              </p>
              <h3 className="font-VTEXTrust leading-8 text-xl mb-8">
                Orchestrate your data
              </h3>
              <p className="text-[#4A596B] mb-8 leading-7">
                Use our GraphQL data layer to connect to your ecommerce provider
                and extend it to fetch data from external services.
              </p>
              <Link
                to="reference/api/faststore-api"
                className="button-secondary"
              >
                CONNECT YOUR DATA
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 w-full lg:max-w-6xl my-16">
          <div className="grid gap-20 auto-cols-fr lg:grid-flow-col">
            <div className="my-auto">
              <h2 className="text-4xl font-VTEXTrust text-fontSecondary mb-8 leading-snug">
                Easily manage all meaningful states of your store
              </h2>
              <h3 className="font-VTEXTrust leading-8 text-xl mb-8">
                Improve your sales with Google Analytics 4
              </h3>
              <p className="text-[#4A596B] mb-8 leading-7">
                Use our hooks and utils to quickly integrate your website with
                Google Analytics 4 and make data-driven decisions.
              </p>
              <h3 className="font-VTEXTrust leading-8 text-xl mb-8">
                Handle side effects to deliver better experiences
              </h3>
              <p className="text-[#4A596B] mb-8 leading-7">
                Refer to our SDKs to build tailor-made solutions and deliver a
                better UX for your shoppers.
              </p>
              <Link
                to="reference/sdk/faststore-sdk"
                className="button-secondary"
              >
                BUILD TAILOR-MADE SOLUTIONS
              </Link>
            </div>

            <img src="img/event.png" />
          </div>
        </div>

        <div className="bg-[#ffe0ef]">
          <div className="mx-auto p-4 w-full lg:max-w-6xl lg:py-20">
            <div className="flex justify-between mb-16">
              <div className='w-2/5 pr-10'>
                <h2 className="text-2xl font-VTEXRegular text-seriousBlack leading-relaxed">
                  Bring your preferred tech stack or quick start with our opinionated solution
                </h2>
              </div>
              <div className='grid grid-cols-2 gap-16'>
                <div className='grid gap-8'>
                  <div>
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" fill='#e31c58' className='w-5 h-5 inline-block mr-2' viewBox="0 0 28 28"> <path d="M14 0C6.3 0 0 6.3 0 14C0 21.7 6.3 28 14 28C21.7 28 28 21.7 28 14C28 6.3 21.7 0 14 0ZM12.25 19.95L6.3 14L8.75 11.55L12.25 15.05L19.25 8.05L21.7 10.5L12.25 19.95Z" /> </svg>
                    <p className="inline">Launch with any deployment platform</p>
                  </div>
                  <div>
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" fill='#e31c58' className='w-5 h-5 inline-block mr-2' viewBox="0 0 28 28"> <path d="M14 0C6.3 0 0 6.3 0 14C0 21.7 6.3 28 14 28C21.7 28 28 21.7 28 14C28 6.3 21.7 0 14 0ZM12.25 19.95L6.3 14L8.75 11.55L12.25 15.05L19.25 8.05L21.7 10.5L12.25 19.95Z" /> </svg>
                    <p className="inline">Integrate with any headless CMS</p>
                  </div>
                  <div>
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" fill='#e31c58' className='w-5 h-5 inline-block mr-2' viewBox="0 0 28 28"> <path d="M14 0C6.3 0 0 6.3 0 14C0 21.7 6.3 28 14 28C21.7 28 28 21.7 28 14C28 6.3 21.7 0 14 0ZM12.25 19.95L6.3 14L8.75 11.55L12.25 15.05L19.25 8.05L21.7 10.5L12.25 19.95Z" /> </svg>
                    <p className="inline">Build with any site generator</p>
                  </div>
                </div>
                <div className='grid gap-8'>
                  <div>
                    <svg role="img" xmlns="http://www.w3.org/2000/svg" fill='#e31c58' className='w-5 h-5 inline-block mr-2' viewBox="0 0 28 28"> <path d="M14 0C6.3 0 0 6.3 0 14C0 21.7 6.3 28 14 28C21.7 28 28 21.7 28 14C28 6.3 21.7 0 14 0ZM12.25 19.95L6.3 14L8.75 11.55L12.25 15.05L19.25 8.05L21.7 10.5L12.25 19.95Z" /> </svg>
                    <p className="inline">Develop with any CSS framework</p>
                  </div>
                </div>
              </div>
            </div>
            <i className="text-sm text-[#4A596B] float-right">
              * Joining the Beta program is mandatory to benefit from VTEX
              support, WebOps and Headless CMS.
            </i>
          </div>
        </div>

        <div className="bg-rebelPink">
          <div className="mx-auto px-4 w-full lg:max-w-6xl py-24">
            <h2 className="text-5xl text-white font-VTEXTrust leading-tight lg:mr-30 mb-8">
              Go live with the full VTEX solution for building lightning-fast
              shopping experiences.
            </h2>
            <Link to="beta/about" className="button-secondary">
              LEARN MORE
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
