import React from 'react'

const Callout = ({ children }) => {
  return (
    <section className="sbdocs-callout">
      <span aria-label="Warning">&#x1F4A1;</span>
      <small>{children}</small>
    </section>
  )
}

export default Callout
