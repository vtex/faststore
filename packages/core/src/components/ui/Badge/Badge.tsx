import { Badge as UIBadge } from '@faststore/ui'
import type { ReactNode } from 'react'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

export type BadgeVariants = 'info' | 'highlighted' | 'success' | 'neutral'

type InteractiveBadge =
  | {
      interactive: true
      onClose?: () => void
    }
  | {
      interactive?: false
      onClose?: never
    }

type Props = {
  big?: boolean
  variant?: BadgeVariants
  children: ReactNode
  onClose?: () => void
  interactive?: boolean
} & InteractiveBadge

const Badge = ({
  variant = 'neutral',
  children,
  onClose,
  big = false,
  interactive = false,
  ...otherProps
}: Props) => {
  return (
    <UIBadge
      data-fs-badge={big ? 'big' : ''}
      data-fs-badge-variant={variant}
      data-fs-badge-interactive={interactive}
      {...otherProps}
    >
      {interactive && (
        <Button
          data-fs-badge-button="true"
          aria-label="Remove"
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
