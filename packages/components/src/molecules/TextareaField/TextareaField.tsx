import type { MutableRefObject } from 'react'
import React, { useEffect, useRef } from 'react'

import type { TextareaProps } from '../..'
import { Textarea, Label } from '../..'

type DefaultProps = {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * ID to identify textarea and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify textarea.
   */
  label: string
  /**
   * The error message is displayed when an error occurs.
   */
  error?: string
  /**
   * Component's ref.
   */
  textareaRef?: MutableRefObject<HTMLTextAreaElement | null>
  /**
   * Specifies that the whole textarea component should be disabled.
   */
  disabled?: boolean
}

export type TextareaFieldProps = DefaultProps &
  Omit<TextareaProps, 'disabled' | 'onSubmit'>

const TextareaField = ({
  id,
  label,
  error,
  placeholder = ' ', // initializes with an empty space to style float label using `placeholder-shown`
  textareaRef,
  disabled,
  value,
  testId = 'fs-textarea-field',
  ...otherProps
}: TextareaFieldProps) => {
  const shouldDisplayError = !disabled && error && error !== ''
  const textareaInternalRef = useRef<HTMLTextAreaElement | null>(null)
  const ref = textareaRef || textareaInternalRef

  useEffect(() => {
    const textarea = ref?.current
    if (!textarea) return

    const updateSize = () => {
      textarea.parentElement?.style.setProperty(
        '--fs-textarea-width',
        `${textarea.offsetWidth}px`
      )
      textarea.parentElement?.style.setProperty(
        '--fs-textarea-height',
        `${textarea.offsetHeight}px`
      )
    }

    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(textarea)

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])

  return (
    <div
      data-fs-textarea-field
      data-fs-textarea-field-error={error && error !== ''}
      data-testid={testId}
    >
      <Textarea
        id={id}
        value={value}
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        {...otherProps}
      />
      <Label data-fs-textarea-field-label htmlFor={id}>
        {label}
      </Label>

      {shouldDisplayError && (
        <span data-fs-textarea-field-error-message>{error}</span>
      )}
    </div>
  )
}

export default TextareaField
