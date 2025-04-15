import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import Icon from '../../atoms/Icon'
import IconButton from '../IconButton'

import { useOnClickOutside, useUI } from '../../hooks'

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
   * Close button aria-label.
   */
  closeButtonAriaLabel?: string
  /**
   * Controls whether the Popover is open.
   */
  isOpen: boolean
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Offset value for top position (e.g.: 12).
   * @default '8'
   */
  offsetTop?: number
  /**
   * Offset value for left position (e.g.: 12).
   * @default '0'
   */
  offsetLeft?: number
  /**
   * Reference to the trigger element that opens the Popover.
   */
  triggerRef?: React.RefObject<HTMLButtonElement>
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    title,
    content,
    placement = 'bottom-center',
    dismissible = false,
    onDismiss,
    isOpen,
    triggerRef: propTriggerRef,
    offsetTop = 8,
    offsetLeft = 0,
    closeButtonAriaLabel = 'Close Popover',
    testId = 'fs-popover',
    ...otherProps
  },
  ref
) {
  // Use forwarded ref or internal ref for fallback
  const popoverRef = ref || useRef<HTMLDivElement>(null)

  // Set the position according to the trigger element
  const [styles, setStyles] = useState({ top: 0, left: 0 })

  const { popover } = useUI()
  const contextTriggerRef = popover.triggerRef

  // Use the propTriggerRef if provided, otherwise fallback to contextTriggerRef
  const triggerRef = propTriggerRef || contextTriggerRef

  useEffect(() => {
    if (!isOpen || !triggerRef?.current) return

    const rect = triggerRef.current.getBoundingClientRect()

    setStyles({
      top: rect.top + window.scrollY + offsetTop,
      left: rect.left + window.scrollX + offsetLeft,
    })
  }, [isOpen, triggerRef, offsetTop, offsetLeft])

  const handleDismiss = () => {
    onDismiss?.()
  }

  useOnClickOutside(
    popoverRef as React.RefObject<HTMLDivElement>,
    handleDismiss
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      handleDismiss()
    }
  }

  if (!isOpen) {
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
      style={{
        ...styles,
      }}
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
            aria-label={closeButtonAriaLabel}
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
