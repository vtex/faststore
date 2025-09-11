import React, {
  type ReactNode,
  useState,
  useRef,
  useEffect,
  type ComponentProps,
} from 'react'
import Icon from '../../atoms/Icon'
import IconButton from '../IconButton'

/**
 * Specifies tooltip position.
 */
export type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Specifies tooltip alignment.
 */
export type Alignment = 'start' | 'center' | 'end'

/**
 * Combines side + alignment (e.g., "top-start").
 */
export type Placement = `${Side}-${Alignment}`

export interface TooltipProps extends Omit<ComponentProps<'div'>, 'content'> {
  /**
   * Text/content of the tooltip.
   */
  content: ReactNode
  /**
   * Defines the side or side-alignment (e.g., "top-center", "right-end") of the tooltip.
   */
  placement?: Placement
  /**
   * If the tooltip can be closed by a button.
   */
  dismissible?: boolean
  /**
   * Called when the dismiss button is clicked.
   */
  onDismiss?: (
    ev:
      | React.KeyboardEvent<HTMLDivElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => void
  /**
   * Element that activates the tooltip on hover/focus.
   */
  children: ReactNode
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Maximum width of the tooltip.
   */
  maxWidth?: number
  /**
   * ID for the tooltip content to be used with aria-describedby.
   */
  describedById?: string
}

export default function Tooltip({
  content,
  placement = 'top-center',
  dismissible = false,
  onDismiss,
  children,
  testId = 'fs-tooltip',
  maxWidth = 300,
  describedById = 'tooltip-content',
  ref,
  ...otherProps
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const dismissButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleDismiss = (
    ev:
      | React.KeyboardEvent<HTMLDivElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    onDismiss?.(ev)
    setOpen(false)
    setDismissed(true)
  }

  const toggleOpen = () => {
    if (dismissed) {
      setDismissed(false)
    }
    setOpen(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      handleDismiss(event)
    }
  }

  useEffect(() => {
    if (open && dismissible) {
      dismissButtonRef.current?.focus()
    }
  }, [open, dismissible])

  return (
    <div
      data-fs-tooltip
      onMouseEnter={toggleOpen}
      onMouseLeave={() => setOpen(false)}
      onFocus={toggleOpen}
      onBlur={() => setOpen(false)}
      data-testid={testId}
      aria-describedby={describedById}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={triggerRef}
    >
      {children}

      {open && !dismissed && (
        <div
          ref={ref}
          data-fs-tooltip-wrapper
          data-fs-tooltip-placement={placement}
          data-fs-tooltip-dismissible={dismissible}
          role="tooltip"
          onKeyDown={handleKeyDown}
          style={{ maxWidth }}
          {...otherProps}
        >
          <div data-fs-tooltip-content id={describedById}>
            {content}
          </div>
          {dismissible && (
            <IconButton
              size="small"
              variant="tertiary"
              inverse
              icon={<Icon name="X" width={20} height={20} />}
              aria-label="Dismiss tooltip"
              data-fs-tooltip-dismiss-button
              onClick={handleDismiss}
              ref={dismissButtonRef}
            />
          )}
          <div data-fs-tooltip-indicator aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
