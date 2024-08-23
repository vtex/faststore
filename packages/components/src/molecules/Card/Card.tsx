import type { HTMLAttributes } from "react";
import React, { forwardRef } from 'react'

import { IconButton, Icon } from '../..'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
  * Specifies the text to be loaded into the header.
  */
  title: string
  /**
  * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
  */
  testId?: string
  /**
  * Specifies the card max width.
  */
  maxWidth?: string
  /**
  * Specifies what icon to use following the FastStore Icon sheet.
  */
  iconName?: string
  /**
  * Function that should be executed when the icon is clicked
  */
  iconAction?: () => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card({
  title,
  maxWidth,
  testId = 'fs-card',
  iconName,
  iconAction,
  children,
  ...otherProps
}, ref) {
  return (
    <section data-testid={testId} ref={ref} data-fs-card style={{ maxWidth: `${maxWidth}` }} {...otherProps}>
      <div data-fs-card-header>
        <div data-fs-card-title>{title}</div>
        {iconName && (
          <IconButton icon={<Icon name={iconName} width={20} height={20} />}
            aria-label={`${title} action`} onClick={iconAction} />
        )}
      </div>
      <div data-fs-card-body>
        {children}
      </div>
    </section >
  )
})

export default Card
