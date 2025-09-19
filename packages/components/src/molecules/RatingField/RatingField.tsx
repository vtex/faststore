import type { Ref } from 'react'
import { Label, Rating, type RatingProps } from '../..'

interface DefaultProps {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify the input rating.
   */
  label: string
  /**
   * The error message displayed when an error occurs.
   */
  error?: string
  /**
   * Component's ref.
   */
  ratingRef?: Ref<HTMLUListElement>
}

export type RatingFieldProps = DefaultProps & RatingProps

export default function RatingField({
  id,
  label,
  error,
  disabled,
  length = 5,
  value = 0,
  onChange,
  ratingRef,
  testId = 'fs-rating-field',
  ...otherProps
}: RatingFieldProps) {
  const shouldDisplayError = !disabled && error && error !== ''

  return (
    <div
      data-fs-rating-field
      data-fs-rating-field-error={shouldDisplayError}
      data-fs-rating-field-disabled={disabled}
      data-testid={testId}
    >
      <Label data-fs-rating-field-label htmlFor={id}>
        {label}
      </Label>
      <Rating
        id={id}
        data-fs-rating-field-input
        ref={ratingRef}
        length={length}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...otherProps}
      />
      {shouldDisplayError && (
        <span data-fs-rating-field-error-message>{error}</span>
      )}
    </div>
  )
}
