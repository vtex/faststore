import type { PropsWithChildren } from 'react'

import styles from './empty-state.module.scss'

type Variant = 'default' | 'rounded'

interface Props {
  variant?: Variant
}

function EmptyState({
  children,
  variant = 'default',
}: PropsWithChildren<Props>) {
  return (
    <section
      className={styles.fsEmptyState}
      data-fs-empty-state
      data-fs-empty-state-variant={variant}
    >
      {children}
    </section>
  )
}

export default EmptyState
