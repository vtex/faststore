import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
export default function PaginatorNavLink(props) {
  const { permalink, title, isNext } = props
  return (
    <Link to={permalink} className="hover:no-underline hover:brightness-125">
      <div
        className={clsx(
          'text-sm font-VTEXMedium',
          isNext
            ? 'after:content-["»"] after:ml-1'
            : 'before:content-["«"] before:mr-1'
        )}
      >
        {title}
      </div>
    </Link>
  )
}
