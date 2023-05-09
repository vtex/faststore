import type { ReactNode } from 'react'
import React, { forwardRef } from 'react'
import { Badge, BadgeProps, Icon } from '../..'

export interface TagProps extends BadgeProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The text displayed inside the tag.
   */
  label: string
  /**
   * A React component that will be rendered as an icon.
   */
  icon?: ReactNode
  /**
   * For accessibility purposes, provide an ARIA label to the Icon button
   */
  iconButtonLabel?: string
  /**
   * Function called when Icon button is clicked.
   */
  onClose: () => void
}

const Tag = forwardRef<HTMLDivElement, TagProps>(function Tag(
  { testId = 'fs-tag', label, icon, iconButtonLabel, onClose, ...otherProps },
  ref
) {
  return (
    <Badge
      ref={ref}
      data-fs-tag
      size="big"
      data-testid={testId}
      {...otherProps}
    >
      <span data-fs-tag-label>{label}</span>
      <button
        data-fs-tag-icon-button
        aria-label={iconButtonLabel ? iconButtonLabel : 'remove'}
        onClick={onClose}
      >
        {!!icon ? icon : <Icon name="X" />}
      </button>
    </Badge>
  )
})

export default Tag
