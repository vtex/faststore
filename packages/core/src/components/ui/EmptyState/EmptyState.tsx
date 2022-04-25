import type { PropsWithChildren } from 'react'

function EmptyState({ children }: PropsWithChildren<unknown>) {
  return (
    <section className="empty-state" data-empty-state>
      {children}
    </section>
  )
}

export default EmptyState
