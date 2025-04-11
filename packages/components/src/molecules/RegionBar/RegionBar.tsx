import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Button } from '../../'

export interface RegionBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Postal code string to be display in the component
   */
  postalCode?: string
  /**
   * Function called when button is clicked.
   */
  onButtonClick?: () => void
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  /**
   * Specifies a label for the location text.
   */
  label: string
  /**
   * Specifies a label for the edit text.
   */
  editLabel?: string
  /**
   * A React component that will be rendered as an icon.
   */
  buttonIcon?: ReactNode
  testing?: string
}

const RegionBar = forwardRef<HTMLDivElement, RegionBarProps>(function RegionBar(
  {
    postalCode,
    icon,
    label,
    editLabel,
    buttonIcon,
    onButtonClick,
    testing,
    ...otherProps
  },
  ref
) {
  return (
    <div ref={ref} data-fs-region-bar {...otherProps}>
      {testing}
      <Button
        variant="tertiary"
        iconPosition="right"
        onClick={onButtonClick}
        icon={buttonIcon}
      >
        {!!icon && icon}
        {postalCode ? (
          <>
            <span data-fs-region-bar-postal-code>{postalCode}</span>
            {!!editLabel && <span data-fs-region-bar-cta>{editLabel}</span>}
          </>
        ) : (
          <span data-fs-region-bar-message>{label}</span>
        )}
      </Button>
    </div>
  )
})

export default RegionBar
