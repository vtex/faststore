import React from 'react'

import type { ModalProps, LinkProps, LinkElementType } from '../../'
import { Modal, ModalHeader, ModalBody, Icon, Link } from '../..'

export interface RegionModalProps extends ModalProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The region modal's title.
   */
  title?: string
  /**
   * Description for region modal.
   */
  description?: string
  /**
   * Props for the link `I don't know my Postal Code`.
   */
  idkPostalCodeLinkProps?: Partial<LinkProps<LinkElementType>>
  /**
   * Props for the `I don't know my Postal Code` link on modal body content.
   */
  linkText?: Partial<LinkProps<LinkElementType>>
  /**
   * Function called when dismiss button is clicked.
   */
  onClose?: () => void
}

function RegionModal({
  testId = 'fs-region-modal',
  title = 'Set your location',
  description = 'Prices, offers and availability may vary according to your location.',
  idkPostalCodeLinkProps,
  onClose,
  ...otherProps
}: RegionModalProps) {
  return (
    <Modal data-fs-region-modal testId={testId} {...otherProps}>
      <ModalHeader
        onClose={() => onClose}
        title={title}
        description={description}
        closeBtnProps={{
          'aria-label': 'Close Regionalization Modal',
        }}
      />
      <ModalBody>
        <div data-fs-region-modal-input>
          {/* <RegionInput closeModal={() => onClose()} /> */}
        </div>
        <Link data-fs-region-modal-link {...idkPostalCodeLinkProps}>
          {idkPostalCodeLinkProps?.children ?? (
            <>
              {"I don't know my Postal Code"}
              <Icon name="ArrowSquareOut" width={20} height={20} />
            </>
          )}
        </Link>
      </ModalBody>
    </Modal>
  )
}

export default RegionModal
