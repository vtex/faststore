import React, { HTMLAttributes } from 'react'
import Icon from '../../atoms/Icon'
import IconButton, { IconButtonProps } from '../IconButton'

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Title for header modal.
   */
  title: string

  /**
   * Description for header modal.
   */
  description?: string

  /**
   * Props for the Close Button component.
   */
  closeBtnProps?: Partial<Omit<IconButtonProps, 'onClick'>>

  onClose?: () => void
}

const ModalHeader = ({
  onClose,
  title,
  closeBtnProps = {},
  description,
}: ModalHeaderProps) => {
  return (
    <header data-fs-modal-header>
      {onClose && (
        <IconButton
          onClick={() => onClose?.()}
          data-fs-modal-header-close-button
          icon={<Icon name="X" />}
          aria-label="Close modal"
          {...closeBtnProps}
        />
      )}
      <p data-fs-modal-header-title>{title}</p>
      {description && <p data-fs-modal-header-description>{description}</p>}
    </header>
  )
}

export default ModalHeader
