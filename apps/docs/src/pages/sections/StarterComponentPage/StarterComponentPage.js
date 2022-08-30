import React from 'react'
import Link from '@docusaurus/Link'

const StarterComponentPage = ({ data = {} }) => {
  return (
    <>
      <div className="w-full lg:w-9/12 mx-auto my-5 tracking-wider uppercase text-sm text-fontSecondary font-medium">
        <Link href="/starters">← Back</Link>
      </div>
      <div className="w-full lg:w-9/12 lg:relative bg-whiteIce container mb-20 mx-auto rounded-lg justify-between">
        <div className="w-full lg:w-3/6 lg:px-16 p-6 py-12">
          <h1 className="text-5xl font-VTEXMedium text-fontSecondary">
            {data.name}
          </h1>
          <div className="text-fontSecondary tracking-wide text-sm font-VTEXMedium ml-1 mt-1">
            DEVELOPED BY <a href={data.ownerWebsite}>{data.owner}</a>
          </div>
          <p
            className="text-details mt-5 text-lg"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />

          <Link to={data.demoURL} className="button-secondary my-5">VIEW DEMO STORE</Link>

          <div className='text-fontSecondary'>
            <p className="text-sm font-VTEXMedium tracking-wider mt-4">
              COMES WITH:
            </p>
            <ul>
              {data.features?.map((feature) => (
                <li key={feature} className=" ml-5 list-disc">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="block mt-6">
            <span className="text-sm font-VTEXMedium tracking-wider">
              START WITH:
            </span>
            {data.gatsbyRepo && (
              <Link
                className="w-5 h-5 ml-2 inline-block align-baseline"
                href={data.gatsbyRepo}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x={0}
                  y={0}
                  viewBox="0 0 28 28"
                >
                  <g id="monogram">
                    <circle
                      cx={14}
                      cy={14}
                      r={14}
                      fill="var(--ifm-color-details)"
                      className="hover:fill-rebelPink"
                    />
                    <path
                      fill="var(--ifm-tag-background)"
                      d="M6.2 21.8C4.1 19.7 3 16.9 3 14.2L13.9 25c-2.8-.1-5.6-1.1-7.7-3.2zM16.4 24.7 3.3 11.6C4.4 6.7 8.8 3 14 3c3.7 0 6.9 1.8 8.9 4.5l-1.5 1.3C19.7 6.5 17 5 14 5c-3.9 0-7.2 2.5-8.5 6L17 22.5c2.9-1 5.1-3.5 5.8-6.5H18v-2h7c0 5.2-3.7 9.6-8.6 10.7z"
                    />
                  </g>
                </svg>
              </Link>
            )}
            {data.nextRepo && (
              <Link
                className="w-5 h-5 ml-2 inline-block align-baseline"
                href={data.nextRepo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                  <path
                    fill="var(--ifm-color-details)"
                    className="hover:fill-rebelPink"
                    d="M119.617.069c-.55.05-2.302.225-3.879.35-36.36 3.278-70.419 22.894-91.99 53.044-12.012 16.764-19.694 35.78-22.597 55.922C.125 116.415 0 118.492 0 128.025c0 9.533.125 11.61 1.151 18.64 6.957 48.065 41.165 88.449 87.56 103.411 8.309 2.678 17.067 4.504 27.027 5.605 3.879.425 20.645.425 24.524 0 17.192-1.902 31.756-6.155 46.12-13.486 2.202-1.126 2.628-1.426 2.327-1.677-.2-.15-9.584-12.735-20.845-27.948l-20.47-27.648-25.65-37.956c-14.114-20.868-25.725-37.932-25.825-37.932-.1-.025-.2 16.84-.25 37.431-.076 36.055-.1 37.506-.551 38.357-.65 1.226-1.151 1.727-2.202 2.277-.801.4-1.502.475-5.28.475h-4.33l-1.15-.725a4.679 4.679 0 0 1-1.677-1.827l-.526-1.126.05-50.166.075-50.192.776-.976c.4-.525 1.251-1.2 1.852-1.526 1.026-.5 1.426-.55 5.755-.55 5.105 0 5.956.2 7.282 1.651.376.4 14.264 21.318 30.88 46.514 16.617 25.195 39.34 59.599 50.5 76.488l20.27 30.7 1.026-.675c9.084-5.905 18.693-14.312 26.3-23.07 16.191-18.59 26.626-41.258 30.13-65.428 1.026-7.031 1.151-9.108 1.151-18.64 0-9.534-.125-11.61-1.151-18.641-6.957-48.065-41.165-88.449-87.56-103.411-8.184-2.652-16.892-4.479-26.652-5.58-2.402-.25-18.943-.525-21.02-.325Zm52.401 77.414c1.201.6 2.177 1.752 2.527 2.953.2.65.25 14.562.2 45.913l-.074 44.987-7.933-12.16-7.958-12.16v-32.702c0-21.143.1-33.028.25-33.603.4-1.401 1.277-2.502 2.478-3.153 1.026-.525 1.401-.575 5.33-.575 3.704 0 4.354.05 5.18.5Z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
        <img
          className="lg:pr-10 w-full lg:w-6/12 static lg:absolute lg:bottom-0 lg:right-0"
          src={data.img}
        ></img>
      </div>
    </>
  )
}

export default StarterComponentPage