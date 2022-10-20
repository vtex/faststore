import { Badge as UIBadge } from '@faststore/ui'
import type { ReactNode } from 'react'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import styles from './badge.module.scss'

export type BadgeVariants =
  | 'info'
  | 'highlighted'
  | 'success'
  | 'neutral'
  | 'warning'
  | 'danger'

type ActionableBadge =
  | {
      actionable: true
      onClose?: () => void
    }
  | {
      actionable?: false
      onClose?: never
    }

export type BadgeProps = {
  /**
   * Sets the component's size.
   */
  big?: boolean
  /**
   * Specifies the component variant.
   */
  variant?: BadgeVariants
  children: ReactNode
  onClose?: () => void
  /**
   * Adds a Close Button to the component.
   */
  actionable?: boolean
} & ActionableBadge

const Badge = ({
  variant = 'neutral',
  children,
  onClose,
  big = false,
  actionable = false,
  ...otherProps
}: BadgeProps) => {
  return (
    <UIBadge
      className={styles.fsBadge}
      data-fs-badge={big ? 'big' : ''}
      data-fs-badge-variant={variant}
      data-fs-badge-actionable={actionable}
      {...otherProps}
    >
      {actionable && (
        <Button
          aria-label="Remove"
          data-fs-badge-button
          onClick={onClose}
          icon={<Icon name="X" width={18} height={18} weight="bold" />}
          iconPosition="left"
        />
      )}
      <div data-fs-badge-wrapper>
        <span>{children}</span>
      </div>
    </UIBadge>
  )
}

export default Badge
