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

/**
 * `top` / `bottom` / `left` are all optional so portal calcs can use either
 * vertical anchor; `transform` must always be set in portal mode to suppress
 * the stylesheet transform that uses % values unsuitable for fixed positioning.
 */
type PopoverCoords = {
  top?: number
  bottom?: number
  left: number
  transform?: string
}

/**
 * For portal (`position: fixed`) we compute pixel coords from
 * `getBoundingClientRect()` (viewport-relative). We use `bottom` instead of
 * `top` for `top-*` placements so the arrow sits just above the trigger without
 * fighting the CSS `bottom: 100%` rule.
 * For non-portal (`position: absolute`) we keep the original simple coords and
 * let the stylesheet handle placement/transforms.
 */
const calculatePosition = (
  rect: DOMRect,
  placement: Placement,
  offsetTop: number,
  offsetLeft: number,
  enablePortal: boolean
): PopoverCoords => {
  const { top, left, height, width } = rect

  if (enablePortal) {
    // pixels from viewport bottom to the trigger's top edge (with optional gap)
    const bottomAnchor = window.innerHeight - rect.top + offsetTop
    // pixels from viewport top to the trigger's bottom edge (with optional gap)
    const topAnchor = top + height + offsetTop

    switch (true) {
      case placement.startsWith('top'): {
        if (placement === 'top-center') {
          return {
            bottom: bottomAnchor,
            left: left + width / 2 + offsetLeft,
            transform: 'translateX(-50%)',
          }
        }
        if (placement === 'top-end') {
          return {
            bottom: bottomAnchor,
            left: left + width + offsetLeft,
            transform: 'translateX(-100%)',
          }
        }
        // top-start
        return {
          bottom: bottomAnchor,
          left: left + offsetLeft,
          transform: 'none',
        }
      }
      case placement.startsWith('bottom'): {
        if (placement === 'bottom-center') {
          return {
            top: topAnchor,
            left: left + width / 2 + offsetLeft,
            transform: 'translateX(-50%)',
          }
        }
        if (placement === 'bottom-end') {
          return {
            top: topAnchor,
            left: left + width + offsetLeft,
            transform: 'translateX(-100%)',
          }
        }
        // bottom-start
        return {
          top: topAnchor,
          left: left + offsetLeft,
          transform: 'none',
        }
      }
      default:
        return { top: 0, left: 0, transform: 'none' }
    }
  }

  // Non-portal: absolute positioning; let CSS handle placement transforms
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
  const localRef = useRef<HTMLDivElement>(null)
  const popoverRef = ref ?? localRef

  const [popoverPosition, setPopoverPosition] = useState<PopoverCoords>({
    top: 0,
    left: 0,
  })

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
        top: popoverPosition.top,
        bottom: popoverPosition.bottom,
        left: popoverPosition.left,
        // In portal mode the transform is always provided (even 'none') to
        // prevent the stylesheet transform from applying to fixed coordinates.
        ...(popoverPosition.transform !== undefined
          ? { transform: popoverPosition.transform }
          : {}),
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