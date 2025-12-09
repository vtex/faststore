import type {
  AriaAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

import { Icon, IconButton, Input } from '../..'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onSubmit'>

type ButtonProps = {
  onClick?: () => void
  testId?: string
}

export interface SearchInputFieldProps extends InputProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Props for the submit button inside the input.
   */
  buttonProps?: ButtonProps
  /**
   * A React component that will be rendered as an icon (submit button).
   * @default <Icon name="MagnifyingGlass" />
   */
  buttonIcon?: ReactNode
  /**
   * Whether to show the attachment button.
   * @default false
   */
  showAttachmentButton?: boolean
  /**
   * Props for the paperclip button inside the input.
   */
  attachmentButtonProps?: ButtonProps
  /**
   * A React component that will be rendered as an icon (attachment button).
   * @default <Icon name="Paperclip" />
   */
  attachmentButtonIcon?: ReactNode
  /**
   * Custom aria-label for input and button.
   */
  'aria-label'?: AriaAttributes['aria-label']
  /**
   * Callback function when submitted.
   */
  onSubmit: (value: string) => void
  /**
   * Show upload button
   */
  showUploadButton?: boolean
  /**
   * Props for the upload button inside the input.
   */
  buttonUploadProps?: ButtonProps
  /**
   * Callback function when upload button is clicked
   */
  onUploadClick?: () => void
}

export interface SearchInputFieldRef {
  inputRef?: HTMLInputElement | null
  formRef?: HTMLFormElement | null
}

const SearchInputField = forwardRef<
  SearchInputFieldRef | null,
  SearchInputFieldProps
>(function SearchInputField(
  {
    onSubmit,
    buttonIcon,
    showAttachmentButton = false,
    attachmentButtonIcon,
    attachmentButtonProps,
    'aria-label': ariaLabel = 'search',
    testId = 'fs-search-input',
    buttonProps,
    showUploadButton = false,
    buttonUploadProps,
    onUploadClick,
    ...otherProps
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (inputRef.current?.value !== '') {
      onSubmit(inputRef.current!.value)
    }
  }

  useImperativeHandle(ref, () => ({
    inputRef: inputRef.current,
    formRef: formRef.current,
  }))

  return (
    <div data-fs-search-input-field-wrapper>
      <form
        ref={formRef}
        data-fs-search-input-field
        data-testid={testId}
        onSubmit={handleSubmit}
        role="search"
      >
        <Input
          ref={inputRef}
          aria-label={ariaLabel}
          data-fs-search-input-field-input
          {...otherProps}
        />

        <div data-fs-search-input-field-actions>
          {showAttachmentButton && (
            <>
              <IconButton
                type="button"
                aria-label="Attach File"
                icon={attachmentButtonIcon ?? <Icon name="Paperclip" />}
                size="small"
                data-fs-search-input-field-attachment-button
                {...attachmentButtonProps}
              />

              <span data-fs-search-input-field-separator />
            </>
          )}

          <IconButton
            type="submit"
            aria-label="Submit Search"
            icon={buttonIcon ?? <Icon name="MagnifyingGlass" />}
            size="small"
            data-fs-search-input-field-submit-button
            {...buttonProps}
          />
        </div>
      </form>
    </div>
  )
})

export default SearchInputField
