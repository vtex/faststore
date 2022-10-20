import React from 'react'
import ComponentCard from '../ComponentCard/ComponentCard'
import { useCurrentSidebarCategory } from '@docusaurus/theme-common'

export default function ComponentsOverview() {
  let items = useCurrentSidebarCategory().items
  return (
    <section>
      {items.map((item) => (
        <>
          <h2 className="font-VTEXMedium">{item.label}</h2>
          <div className="grid grid-cols-2 gap-x-14 gap-y-8 mb-12">
            {item.items.map((link, index) => (
              <article key={index}>
                <ComponentCard key={index} item={link} />
              </article>
            ))}
          </div>
        </>
      ))}
    </section>
  )
}
