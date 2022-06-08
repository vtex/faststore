import React from 'react'
import type { PropsWithChildren } from 'react'

type BestPracticesProps = {
  title?: string
  description?: string
}

const BestPractices = ({ children }: PropsWithChildren<BestPracticesProps>) => {
  return <section className="sbdocs sbdocs-best-practices">{children}</section>
}

export default BestPractices
