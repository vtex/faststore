import React, { ReactNode } from 'react'

type BestPracticesRuleProps = {
  recommendedUsage?: ReactNode
  discouragedUsage?: ReactNode
  recommendedDescription: string | ReactNode
  discouragedDescription: string | ReactNode
}

const BestPracticesRule = ({
  recommendedUsage,
  discouragedUsage,
  recommendedDescription,
  discouragedDescription,
}: BestPracticesRuleProps) => {
  return (
    <section className="sbdocs-best-practices-rule">
      <article>
        {recommendedUsage && <div>{recommendedUsage}</div>}
        <article className="sbdocs-best-practices-text">
          <h3 className="sbdocs sbdocs-h3">
            <span role="img" aria-label="Check Mark">
              &#9989;
            </span>{' '}
            Do
          </h3>
          <p>{recommendedDescription}</p>
        </article>
      </article>
      <article>
        {discouragedUsage && <div>{discouragedUsage}</div>}
        <article className="sbdocs-best-practices-text">
          <h3 className="sbdocs sbdocs-h3">
            <span aria-label="Cross Mark">&#10060;</span> Don't
          </h3>
          <p>{discouragedDescription}</p>
        </article>
      </article>
    </section>
  )
}

export default BestPracticesRule
