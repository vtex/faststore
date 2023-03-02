import React, { HTMLAttributes } from 'react'
import type { ReactNode } from 'react'
import { X } from '../../assets'
import { IconButton } from '../../'
import type { IconButtonProps } from '../../'

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

  onClose: () => void
}

const SlideOverHeader = ({
  onClose,
  children,
  closeBtnProps = {},
}: SlideOverHeaderProps) => {
  return (
    <header data-fs-slide-over-header>
      {children}
      <IconButton
        data-fs-slide-over-header-icon
        aria-label="Close"
        icon={<X />}
        onClick={onClose}
        {...closeBtnProps}
      />
    </header>
  )
}

export default SlideOverHeader
