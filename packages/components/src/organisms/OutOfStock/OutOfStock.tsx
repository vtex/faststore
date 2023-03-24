import React, { useState, forwardRef } from 'react'
import type { FormHTMLAttributes, FormEvent } from 'react'
import { BellRinging } from '../../assets'
import { Button, Icon, InputField, OutOfStockTitle } from '../..'

export interface OutOfStockProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * The Out of Stock Section's title.
   */
  title?: string
  /**
   * The email input label.
   */
  inputLabel: string
  /**
   * Additional message displayed with the title.
   */
  subtitle?: string
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Event emitted when form is submitted.
   */
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  /**
   * The button label.
   */
  buttonLabel: string
  // /**
  //  * Error message displayed when error.
  //  */
  // errorMessage?: string
  // /**
  //  * Specifies that the submit button should be disabled.
  //  */
  // disabled: boolean
}

const OutOfStock = forwardRef<HTMLFormElement, OutOfStockProps>(
  function OutOfStock(
    {
      testId = 'fs-out-of-stock',
      title,
      buttonLabel,
      inputLabel,
      subtitle,
      onSubmit,
      ...otherProps
    },
    ref
  ) {
    const defaultButtonText = buttonLabel

    const [btnText, setBtnText] = useState(defaultButtonText)
    const [disabled, setDisabled] = useState(false)
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const reset = () => {
      setBtnText(defaultButtonText)
      setDisabled(false)

      setEmail('')
      setError('')
    }

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault()

      setDisabled(true)

      try {
        console.log(event)
        // onSubmit()
        // setBtnText(buttonSuccess)
      } catch (err) {
        // setError(err.message)
      } finally {
        // Return to original state after 2s
        setTimeout(reset, 2000)
      }
    }

    return (
      <form
        data-fs-out-of-stock
        ref={ref}
        data-testid={testId}
        onSubmit={handleSubmit}
        {...otherProps}
      >
        <OutOfStockTitle data-fs-out-of-stock-title>{title}</OutOfStockTitle>
        {subtitle && (
          <p data-fs-out-of-stock-message>
            <Icon component={<BellRinging size={16} />} />
            {subtitle}
          </p>
        )}
        <InputField
          id="out-of-stock-email"
          name="out-of-stock-email"
          value={email}
          label={inputLabel}
          aria-label={inputLabel}
          error={error}
          onChange={() => {}}
        />
        <Button
          data-fs-out-of-stock-button
          type="submit"
          disabled={disabled}
          variant="primary"
          icon={<BellRinging />}
          iconPosition="left"
        >
          {btnText}
        </Button>
      </form>
    )
  }
)

export default OutOfStock
