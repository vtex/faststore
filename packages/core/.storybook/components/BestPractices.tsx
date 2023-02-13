import React from 'react'
import type { PropsWithChildren } from 'react'

type BestPracticesProps = {
  title?: string
  description?: string
}

const BestPractices = ({ children }: PropsWithChildren<BestPracticesProps>) => {
  return (
    <>
      <h2 className="sbdocs sbdocs-h2">Best Practices</h2>
      <section className="sbdocs sbdocs-best-practices">{children}</section>
    </>
  )
}

export default BestPractices
