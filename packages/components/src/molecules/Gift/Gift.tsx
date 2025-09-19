import type { ComponentProps, ReactNode } from 'react'

export interface GiftProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
}

export default function Gift({
  icon,
  testId = 'fs-gift',
  children,
  ref,
  ...otherProps
}: GiftProps) {
  return (
    <div ref={ref} data-fs-gift data-testid={testId} {...otherProps}>
      {!!icon && <span data-fs-gift-icon>{icon}</span>}
      <div data-fs-gift-wrapper>{children}</div>
    </div>
  )
}
