import React from 'react'
import Link from '@docusaurus/Link'
import { useDocById } from '@docusaurus/theme-common'

function CardLayout({ href, title, description, image }) {
  return (
    <Link
      href={href}
      className="hover:no-underline text-text"
    >
      {image && <img src={image} className="!m-0 border rounded" />}
      <div className="pt-3">
        <h3 className="truncate" title={title}>
          {title}
        </h3>
        {description && (
          <p className="text-details" title={description}>
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function ComponentCard({ item }) {
  const doc = useDocById(item.docId ?? undefined)
  console.log(item)

  return (
    <CardLayout
      href={item.href}
      title={item.label}
      description={doc?.description}
      image={item.customProps?.image}
    />
  )
}
