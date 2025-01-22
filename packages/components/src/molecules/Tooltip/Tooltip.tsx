import React, {
  type ReactNode,
  type MouseEventHandler,
  useState,
  forwardRef,
  HTMLAttributes,
} from 'react'
import Icon from '../../atoms/Icon'
import IconButton from '../IconButton'
/**
 * Possible sides for the tooltip.
 */
export type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Possible alignments for the tooltip.
 */
export type Alignment = 'start' | 'end'

/**
 * Example: "top", "top-start", "top-end", etc.
 */
export type AlignedPlacement = `${Side}-${Alignment}`

/**
 * Type that combines pure side (e.g., "top") or side + alignment (e.g., "top-start").
 */
export type Placement = Side | AlignedPlacement

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * Text/content of the tooltip.
   */
  content: ReactNode

  /**
   * Defines the side or side-alignment (e.g., "top", "right-end") of the tooltip.
   */
  placement?: Placement

  /**
   * If the tooltip can be closed by a button.
   */
  dismissable?: boolean

  /**
   * (Optional) Called when the dismiss button is clicked.
   */
  onDismiss?: MouseEventHandler<HTMLButtonElement>

  /**
   * Element that activates the tooltip on hover/focus.
   */
  children: ReactNode

  /**
   * For testing (Cypress, Jest, etc.).
   */
  testId?: string

  /**
   * Maximum width of the tooltip.
   */
  maxWidth?: number
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    content,
    placement = 'top',
    dismissable = false,
    onDismiss,
    children,
    testId = 'fs-tooltip',
    maxWidth = 300,
    ...otherProps
  },
  ref
) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss: MouseEventHandler<HTMLButtonElement> = (ev) => {
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

  return (
    <div
      data-fs-tooltip-wrapper
      onMouseEnter={toggleOpen}
      onMouseLeave={() => setOpen(false)}
      onFocus={toggleOpen}
      onBlur={() => setOpen(false)}
      data-testid={testId}
    >
      {children}

      {open && !dismissed && (
        <div
          ref={ref}
          data-fs-tooltip
          data-fs-tooltip-position={placement}
          data-fs-tooltip-dismissable={dismissable}
          style={{ maxWidth }}
          {...otherProps}
        >
          <div data-fs-tooltip-content>{content}</div>
          {dismissable && (
            <IconButton
              size="small"
              variant="tertiary"
              inverse
              icon={<Icon name="X" width={20} height={20} />}
              aria-label="Dismiss tooltip"
              data-fs-tooltip-dismiss-button
              onClick={handleDismiss}
            />
          )}
          <div data-fs-tooltip-indicator aria-hidden="true" />
        </div>
      )}
    </div>
  )
})

export default Tooltip
