import type { ComponentType } from 'react'

export const mark = <P,>(Component: ComponentType<P>): ComponentType<P> =>
  function marked(props: P) {
    if (typeof window !== 'undefined') {
      performance.mark(Component.displayName ?? Component.name ?? 'unknown')
    }

    return <Component {...props} />
  }
