import React from 'react'

import type { ModalProps, LinkProps, LinkElementType } from '../../'
import { Icon, InputField, Link, Modal, ModalHeader, ModalBody } from '../..'

export interface RegionModalProps extends Omit<ModalProps, 'children'> {
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
   * Function called when Close button is clicked.
   */
  onClose?: () => void
  /**
   * Callback function when input is typed.
   */
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void
  /**
   * Callback function when form is submitted.
   */
  onSubmit?: () => void
  /**
   * Callback function when the clear button is clicked.
   */
  onClear?: () => void
  /**
   * Message of error.
   */
  errorMessage?: string
}

function RegionModal({
  testId = 'fs-region-modal',
  title = 'Set your location',
  description = 'Prices, offers and availability may vary according to your location.',
  idkPostalCodeLinkProps,
  errorMessage,
  onClose,
  onInput,
  onSubmit,
  onClear,
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
          <InputField
            id={`${testId}-input-field`}
            // inputRef={inputRef}
            label="Postal Code"
            actionable
            error={errorMessage}
            onInput={(event) => onInput?.(event)}
            onSubmit={() => onSubmit?.()}
            onClear={() => onClear?.()}
          />
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
