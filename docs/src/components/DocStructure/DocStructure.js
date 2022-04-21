import React from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'

let docs = [
  {
    title: 'Getting Started',
    description:
      'New to FastStore? Build storefronts from scratch with our learning-oriented tutorials.',
    url: '/tutorials',
  },
  {
    title: 'How-to Guides',
    url: '/how-to-guides',
    description:
      'Solve real-world issues by following our goal-oriented step-by-step guides.',
  },
  {
    title: 'Reference',
    description:
      "Check the technical descriptions of a storefront project and Faststore's SDKs, APIs.",
    url: '/reference',
  },
  {
    title: 'Concepts',
    description:
      'Dive into our core concepts and build a comprehensive understanding of the project.',
    url: '/conceptual-guides',
  },
]

const DocStructure = () => {
  return (
    <section className="pt-20 border-t sm:pl-10 sm:border-l sm:pt-0 sm:border-t-0">
      <h3 className="mb-6 inline-block text-2xl font-VTEXRegular font-extralight align-middle">
        Explore our documentation
      </h3>
      <div className="grid gap-6 grid-cols-1">
        {docs.map((item, i) => (
          <Link key={i}
            className="focus:no-underline hover:no-underline"
            to={useBaseUrl(item.url)}
          >
            <h4 className="block font-black  text-text hover:text-link">{item.title}</h4>
            <p className="text-details">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default DocStructure
