import React from 'react'

const DocFooter = () => (
  <div className="bg-whiteIce text-text flex items-start justify-between flex-col sm:flex-row my-8 p-8 gap-4">
    <div className="w-full sm:w-4/6 m-auto">
      <p>
        {"Didn't"} find your answers? Ask the Community. For documentation
        suggestions,
        <a
          className="text-details hover:no-underline"
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSfOBYFA9l97ON07-l3SelcKiloTWY55AWu2Wn8LBzZZ6xSLmA/viewform?usp=sf_link"
          rel="noreferrer"
        >
          {' '}
          submit your feedback
        </a>
        .
      </p>
    </div>
    <a
      href="https://community.vtex.com/c/faststore-beta/64"
      target="_blank"
      className="mr-auto whitespace-nowrap hover:text-white hover:no-underline hover:brightness-105 py-3 px-3 rounded text-white font-VTEXMedium text-sm bg-secondary"
      rel="noreferrer"
    >
      JOIN THE COMMUNITY
    </a>
  </div>
)

export default DocFooter