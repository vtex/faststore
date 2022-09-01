import React from 'react'
import Link from '@docusaurus/Link'

const BackgroundCard = ({ linkTo, title, description, button }) => (
  <Link
    to={linkTo}
    className="p-6 rounded-lg bg-tag overflow-hidden relative inline-flex"
  >
    <div>
      <h2 className="text-lg font-VTEXMedium">{title}</h2>
      <p className=" w-2/3">{description}</p>
      <button className="block uppercase bg-white p-2 mt-4 mb-1 text-sm rounded-lg">
        {button}
      </button>
    </div>
  </Link>
)

export default BackgroundCard
