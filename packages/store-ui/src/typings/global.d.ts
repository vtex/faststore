import type { SxStyleProp } from 'theme-ui'
import type { SerializedStyles } from 'emotion'

declare module 'react' {
  interface DOMAttributes {
    sx?: SxStyleProp
    css?: SerializedStyles
  }
}

export declare global {
  namespace globalThis {
    function requestIdleCallback(args: () => void): number
    function cancelIdleCallback(id: number): void
  }

  namespace JSX {
    /**
     * Do we need to modify `LibraryManagedAttributes` too,
     * to make `className` props optional when `css` props is specified?
     */

    interface IntrinsicAttributes {
      sx?: SxStyleProp
      css?: SerializedStyles
    }
  }
}
