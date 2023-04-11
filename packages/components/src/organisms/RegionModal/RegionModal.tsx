import React from 'react'

import type { MutableRefObject } from 'react'
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
   * Message of error for input.
   */
  errorMessage?: string
  /**
   * Postal code input's ref.
   */
  inputRef?: MutableRefObject<HTMLInputElement | null>
  /**
   * Postal code input's value.
   */
  inputValue?: string
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
   * Callback function when the input clear button is clicked.
   */
  onClear?: () => void
}

function RegionModal({
  testId = 'fs-region-modal',
  title = 'Set your location',
  description = 'Prices, offers and availability may vary according to your location.',
  idkPostalCodeLinkProps,
  errorMessage,
  inputRef,
  inputValue,
  onClose,
  onInput,
  onSubmit,
  onClear,
  ...otherProps
}: RegionModalProps) {
  return (
    <Modal data-fs-region-modal testId={testId} {...otherProps}>
      {({ fadeOut }) => (
        <>
          <ModalHeader
            onClose={() => {
              fadeOut()
              onClose?.()
            }}
            title={title}
            description={description}
            closeBtnProps={{
              'aria-label': 'Close Regionalization Modal',
            }}
          />
          <ModalBody>
            <InputField
              data-fs-region-modal-input
              id={`${testId}-input-field`}
              inputRef={inputRef}
              label="Postal Code"
              actionable
              value={inputValue}
              onInput={(event) => onInput?.(event)}
              onSubmit={() => onSubmit?.()}
              onClear={() => onClear?.()}
              error={errorMessage}
            />

            <Link data-fs-region-modal-link {...idkPostalCodeLinkProps}>
              {idkPostalCodeLinkProps?.children ?? (
                <>
                  {"I don't know my Postal Code"}
                  <Icon name="ArrowSquareOut" width={20} height={20} />
                </>
              )}
            </Link>
          </ModalBody>
        </>
      )}
    </Modal>
  )
}

export default RegionModal
