import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { Button, Icon } from '../../'
import { MapPin, CaretRight } from '../../'

export interface RegionBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Postal code string to be display in the component
   */
  postalCode?: string
  /**
   * Function called when button is clicked.
   */
  onButtonClick?: () => void
}

const RegionBar = forwardRef<HTMLDivElement, RegionBarProps>(function RegionBar(
  { postalCode, onButtonClick, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-region-bar {...otherProps}>
      <Button onClick={onButtonClick}>
        <Icon component={<MapPin />} />
        {postalCode ? (
          <>
            <span data-fs-region-bar-postal-code>{postalCode}</span>
            <span data-fs-region-bar-cta>Edit</span>
          </>
        ) : (
          <span data-fs-region-bar-message>Set your location</span>
        )}
        <Icon component={<CaretRight />} />
      </Button>
    </div>
  )
})

export default RegionBar
