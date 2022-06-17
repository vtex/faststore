import React from 'react'
import clsx from 'clsx'
import DocCard from '@theme/DocCard'
import { findFirstCategoryLink } from '@docusaurus/theme-common'

// Filter categories that don't have a link.
function filterItems(items) {
  return items.filter((item) => {
    if (item.type === 'category') {
      return !!findFirstCategoryLink(item)
    }

    return true
  })
}

export default function DocCardList({ items, className }) {
  return (
    <section className={clsx('row', className)}>
      {filterItems(items).map((item, index) => (
        <article key={index} className="col col--6 margin-bottom--md">
          <DocCard key={index} item={item} />
        </article>
      ))}
    </section>
  )
}
