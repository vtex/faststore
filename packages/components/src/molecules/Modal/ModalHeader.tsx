import React, { HTMLAttributes } from 'react'
import { X } from '../../assets'
import IconButton, { IconButtonProps } from '../IconButton'

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string

  description?: string

  /**
   * A React component that will be rendered as an icon.
   */
  closeButtonProps?: Partial<Omit<IconButtonProps, 'onClick'>>

  onClose?: () => void
}

const ModalHeader = ({
  onClose,
  title,
  closeButtonProps = {},
  description,
}: ModalHeaderProps) => {
  return (
    <header data-fs-modal-header>
      {onClose && (
        <IconButton
          onClick={() => onClose?.()}
          data-fs-modal-header-close-button
          icon={<X />}
          aria-label="Close modal"
          {...closeButtonProps}
        />
      )}
      <p data-fs-modal-header-title>{title}</p>
      {description && <p data-fs-modal-header-description>{description}</p>}
    </header>
  )
}

export default ModalHeader
