import React, {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import Icon from '../../atoms/Icon'
import IconButton from '../IconButton'

import { useOnClickOutside } from '../../hooks'

/**
 * Specifies Popover position.
 */
export type Side = 'bottom'

/**
 * Specifies tooltip alignment.
 */
export type Alignment = 'start' | 'center' | 'end'

/**
 * Combines side + alignment (e.g., "top-start").
 */
export type Placement = `${Side}-${Alignment}`

export interface PopoverProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * The Popover header's title.
   */
  title?: string
  /**
   * Content of the Popover.
   */
  content: ReactNode
  /**
   * Defines the side or side-alignment (e.g., "bottom-start", "bottom-center") of the Popover.
   */
  placement?: Placement
  /**
   * If the Popover can be closed by a button.
   */
  dismissible?: boolean
  /**
   * Called when the Popover is dismissed.
   */
  onDismiss?: () => void
  /**
   * Controls whether the Popover is open.
   */
  open: boolean
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover({
  title,
  content,
  placement = 'bottom-center',
  dismissible = false,
  onDismiss,
  open,
  testId = 'fs-popover',
  ...otherProps
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleDismiss = () => {
    onDismiss?.()
  }

  useOnClickOutside(popoverRef, () => handleDismiss())

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      handleDismiss()
    }
  }

  if (!open) {
    return null
  }

  return (
    <div
      data-fs-popover
      role="dialog"
      ref={popoverRef}
      data-fs-popover-placement={placement}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      {...otherProps}
    >
      <header data-fs-popover-header>
        {title && <h3 data-fs-popover-header-title>{title}</h3>}
        {dismissible && (
          <IconButton
            data-fs-popover-header-dismiss-button
            size="small"
            variant="tertiary"
            icon={<Icon name="X" width={20} height={20} />}
            aria-label="Dismiss popover"
            onClick={handleDismiss}
          />
        )}
      </header>
      <div data-fs-popover-content>{content}</div>
      <span data-fs-popover-indicator aria-hidden="true" />
    </div>
  )
})

export default Popover
