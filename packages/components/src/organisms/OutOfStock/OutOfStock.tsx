import type { FormHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'
import { Button, Icon, InputField } from '../..'

export interface OutOfStockProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The Out of Stock Section's title.
   */
  title?: string
  /**
   * Additional message displayed with the title.
   */
  subtitle?: string
  /**
   * The email input label.
   */
  inputLabel: string
  /**
   * The button label.
   */
  buttonLabel?: string
  /**
   * Specifies a label for loading state.
   */
  loadingLabel?: string
  /**
   * Error message displayed when error.
   */
  errorMessage?: string
  /**
   * Specifies that the submit button should be disabled.
   */
  disabled: boolean
  /**
   * Event emitted when form is submitted.
   */
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const OutOfStock = forwardRef<HTMLFormElement, OutOfStockProps>(
  function OutOfStock(
    {
      testId = 'fs-out-of-stock',
      title,
      buttonLabel = 'Notify Me',
      loadingLabel = 'Loading',
      inputLabel,
      subtitle,
      disabled,
      errorMessage,
      onSubmit,
    },
    ref
  ) {
    return (
      <form
        data-fs-out-of-stock
        ref={ref}
        data-testid={testId}
        onSubmit={onSubmit}
      >
        <h2 data-fs-out-of-stock-title>{title}</h2>
        {subtitle && (
          <p data-fs-out-of-stock-message>
            <Icon name="BellRinging" width={16} height={16} />
            {subtitle}
          </p>
        )}
        <InputField
          id="out-of-stock-email"
          name="out-of-stock-email"
          label={inputLabel}
          aria-label={inputLabel}
          error={errorMessage}
          required
        />
        <Button
          data-fs-out-of-stock-button
          type="submit"
          loading={disabled}
          loadingLabel={loadingLabel}
          disabled={disabled}
          variant="primary"
          icon={<Icon name="BellRinging" />}
          iconPosition="left"
        >
          {buttonLabel}
        </Button>
      </form>
    )
  }
)

export default OutOfStock
