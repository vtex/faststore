import type { PropsWithChildren } from 'react'

type Variant = 'default' | 'rounded'

interface Props {
  variant?: Variant
}

function EmptyState({
  variant = 'default',
  children,
}: PropsWithChildren<Props>) {
  return (
    <section data-fs-empty-state data-fs-empty-state-variant={variant}>
      {children}
    </section>
  )
}

export default EmptyState
