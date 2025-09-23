import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
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

export interface PopoverProps extends Omit<ComponentProps<'div'>, 'content'> {
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
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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
}

const calculatePosition = (
  rect: DOMRect,
  placement: Placement,
  offsetTop: number,
  offsetLeft: number
) => {
  const { top, left, height } = rect

  switch (true) {
    case placement.startsWith('top'):
      return {
        top: top + height + window.scrollY - offsetTop,
        left: left + window.scrollX + offsetLeft,
      }
    case placement.startsWith('bottom'):
      return {
        top: top + height + window.scrollY + offsetTop,
        left: left + window.scrollX + offsetLeft,
      }
    default:
      return { top: 0, left: 0 }
  }
}

export default function Popover({
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
  ref,
  ...otherProps
}: PopoverProps) {
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
      calculatePosition(rect, placement, offsetTop, offsetLeft)
    )

    // Trigger the onEntered callback after positioning
    if (onEntered) {
      onEntered()
    }
  }, [isOpen, triggerRef, offsetTop, offsetLeft, placement])

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

  return (
    <div
      data-fs-popover
      role="dialog"
      ref={popoverRef}
      data-fs-popover-placement={placement}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      style={{ position: 'absolute', ...popoverPosition, ...style }}
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
}
