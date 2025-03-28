import React from 'react'

import type { MutableRefObject } from 'react'
import { InputField, Link, Modal, ModalBody, ModalHeader } from '../..'
import type {
  LinkElementType,
  LinkProps,
  ModalProps,
  OverlayProps,
} from '../../'

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
   * Close button aria-label.
   */
  closeButtonAriaLabel?: string
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
   * Postal code input's label.
   */
  inputLabel?: string
  /**
   * The text displayed on the InputField Button. Suggestion: maximum 9 characters.
   */
  inputButtonActionText?: string
  /**
   * Enables fadeOut effect on modal after onSubmit function
   */
  fadeOutOnSubmit?: boolean
  /**
   * Props forwarded to the `Overlay` component.
   */
  overlayProps?: OverlayProps
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
  /**
   * Determines if the modal can be dismissed using the close button or the Escape key.
   * @default true
   */
  dismissible?: boolean
}

function RegionModal({
  testId = 'fs-region-modal',
  title = 'Set your location',
  description = 'Offers and availability vary by location.',
  closeButtonAriaLabel = 'Close Region Modal',
  idkPostalCodeLinkProps,
  errorMessage,
  inputRef,
  inputValue,
  inputLabel = 'Postal Code',
  inputButtonActionText,
  fadeOutOnSubmit,
  overlayProps,
  onClose,
  onInput,
  onSubmit,
  onClear,
  dismissible = true,
  ...otherProps
}: RegionModalProps) {
  return (
    <Modal
      data-fs-region-modal
      testId={testId}
      overlayProps={overlayProps}
      title="Region modal"
      aria-label="Region modal"
      disableEscapeKeyDown={!dismissible}
      {...otherProps}
    >
      {({ fadeOut }) => (
        <>
          <ModalHeader
            {...(dismissible && {
              onClose: () => {
                fadeOut()
                onClear?.()
                onClose?.()
              },
            })}
            title={title}
            description={description}
            closeBtnProps={{
              'aria-label': closeButtonAriaLabel,
            }}
          />
          <ModalBody>
            <InputField
              data-fs-region-modal-input
              id={`${testId}-input-field`}
              inputRef={inputRef}
              label={inputLabel}
              actionable
              value={inputValue}
              buttonActionText={inputButtonActionText}
              onInput={(event) => onInput?.(event)}
              onSubmit={() => {
                onSubmit?.()
                fadeOutOnSubmit ? fadeOut() : null
              }}
              onClear={() => onClear?.()}
              error={errorMessage}
            />
            <Link data-fs-region-modal-link {...idkPostalCodeLinkProps} />
          </ModalBody>
        </>
      )}
    </Modal>
  )
}

export default RegionModal
