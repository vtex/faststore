import React, { forwardRef } from 'react'
import type { ReactNode } from 'react'
import IconButton from '../../molecules/IconButton'
import Badge, { BadgeProps } from '../../atoms/Badge'
import { X } from '../../../../ui/src/assets'

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
   * Function called when Icon button is clicked.
   */
  onClose?: () => void
}

const Tag = forwardRef<HTMLDivElement, TagProps>(function Tag(
  { testId = 'fs-radio-field', label, icon, onClose, ...otherProps },
  ref
) {
  return (
    <Badge ref={ref} data-fs-tag data-testid={testId} {...otherProps}>
      {label}
      <IconButton
        data-fs-tag-icon-button
        icon={icon ? icon : <X />}
        aria-label="remove"
        onClick={onClose}
      />
    </Badge>
  )
})

export default Tag
