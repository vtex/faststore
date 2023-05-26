import type { ReactNode } from 'react'
import React, { HTMLAttributes } from 'react'
import { Icon, IconButton, IconButtonProps } from '../../'

export interface SlideOverHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * A react component to be used as the title in the header.
   */
  children: ReactNode
  /**
   * Props for the Close Button component.
   */
  closeBtnProps?: Partial<Omit<IconButtonProps, 'onClick'>>
  /**
   * Function called when Close Button is clicked.
   */
  onClose: () => void
}

const SlideOverHeader = ({
  children,
  closeBtnProps = {},
  onClose,
  ...otherProps
}: SlideOverHeaderProps) => {
  return (
    <header data-fs-slide-over-header {...otherProps}>
      {children}
      <IconButton
        data-fs-slide-over-header-icon
        aria-label="Close"
        icon={<Icon name="X" />}
        onClick={onClose}
        {...closeBtnProps}
      />
    </header>
  )
}

export default SlideOverHeader
