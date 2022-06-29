import React from 'react'
import type { PropsWithChildren } from 'react'

type SectionListProps = {
  grid?: 'row' | 'grid'
}

const SectionList = ({
  children,
  grid = 'row',
}: PropsWithChildren<SectionListProps>) => {
  return (
    <section className="sbdocs-list">
      <ul
        className={`sbdocs-ul ${
          grid === 'grid' ? 'sbdocs-ul-grid' : 'sbdocs-ul-row'
        }`}
      >
        {children}
      </ul>
    </section>
  )
}

export default SectionList
