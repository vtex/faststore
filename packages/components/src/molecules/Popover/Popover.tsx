import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import Icon from '../../atoms/Icon'
import IconButton from '../IconButton'

import { useOnClickOutside, useUI } from '../../hooks'

/**
 * Specifies Popover position.
 */
export type Side = 'bottom' | 'top'

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
   * Callback when the Popover is fully rendered and positioned.
   */
  onEntered?: () => void
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
  triggerRef?: RefObject<HTMLElement>
  /**
   * Whether to render the Popover using a React portal.
   * @default false
   */
  enablePortal?: boolean
  /**
   * Props for the wrapper div when using portal.
   */
  wrapperProps?: HTMLAttributes<HTMLDivElement>
}

const calculatePosition = (
  rect: DOMRect,
  placement: Placement,
  offsetTop: number,
  offsetLeft: number,
  enablePortal: boolean
) => {
  const { top, left, height } = rect

  switch (true) {
    case placement.startsWith('top'):
      return {
        top: enablePortal
          ? top + height - offsetTop
          : top + height + window.scrollY - offsetTop,
        left: enablePortal
          ? left + offsetLeft
          : left + window.scrollX + offsetLeft,
      }
    case placement.startsWith('bottom'):
      return {
        top: enablePortal
          ? top + height + offsetTop
          : top + height + window.scrollY + offsetTop,
        left: enablePortal
          ? left + offsetLeft
          : left + window.scrollX + offsetLeft,
      }
    default:
      return { top: 0, left: 0 }
  }
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    title,
    content,
    placement = 'bottom-start',
    dismissible = false,
    onDismiss,
    isOpen,
    triggerRef: propTriggerRef,
    offsetTop = 8,
    offsetLeft = 0,
    closeButtonAriaLabel = 'Close Popover',
    testId = 'fs-popover',
    style,
    onEntered,
    enablePortal = false,
    wrapperProps,
    ...otherProps
  },
  ref
) {
  // Use forwarded ref or internal ref for fallback
  const popoverRef = ref || useRef<HTMLDivElement>(null)

  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const { popover, closePopover } = useUI()

  const contextTriggerRef = popover.triggerRef

  // Use the propTriggerRef if provided, otherwise fallback to contextTriggerRef
  const triggerRef = propTriggerRef || contextTriggerRef

  useEffect(() => {
    if (!isOpen || !triggerRef?.current) return

    // Set the position according to the trigger element and placement
    const rect = triggerRef.current.getBoundingClientRect()

    setPopoverPosition(
      calculatePosition(rect, placement, offsetTop, offsetLeft, enablePortal)
    )

    // Trigger the onEntered callback after positioning
    if (onEntered) {
      onEntered()
    }
  }, [isOpen, triggerRef, offsetTop, offsetLeft, placement, enablePortal])

  const handleDismiss = useCallback(() => {
    closePopover()
    onDismiss?.()
  }, [closePopover, onDismiss])

  useOnClickOutside(
    isOpen ? (popoverRef as RefObject<HTMLDivElement>) : undefined,
    handleDismiss
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        handleDismiss()
      }
    },
    [handleDismiss]
  )

  if (!isOpen) {
    return null
  }

  const popoverElement = (
    <div
      data-fs-popover
      role="dialog"
      ref={popoverRef}
      data-fs-popover-placement={placement}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      style={{
        position: enablePortal ? 'fixed' : 'absolute',
        ...popoverPosition,
        ...style,
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

  if (enablePortal) {
    return createPortal(
      <div {...wrapperProps}>{popoverElement}</div>,
      document.body
    )
  }

  return popoverElement
})

export default Popover
