import type { ReactNode } from 'react'
import { Badge, type BadgeProps, Icon } from '../..'

export interface TagProps extends BadgeProps {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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

export default function Tag({
  testId = 'fs-tag',
  label,
  icon,
  iconButtonLabel,
  onClose,
  ref,
  ...otherProps
}: TagProps) {
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
}
