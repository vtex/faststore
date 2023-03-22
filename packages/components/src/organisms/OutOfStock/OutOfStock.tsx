import React, { useState } from 'react'
import type { FormHTMLAttributes, FormEvent } from 'react'
import { BellRinging } from '../../assets'
import { Button, Icon, InputField, OutOfStockTitle } from '../..'

export interface OutOfStockProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * The Out of Stock Section's title.
   */
  title?: string
  /**
   * The Out of Stock Section's title if user has entered a postal code.
   */
  titleSession?: string
  /**
   * The button text.
   */
  buttonText: string
  buttonSuccess: string
  inputLabel: string
  /**
   * Message describing when the user will be notified.
   */
  notificationMsg?: string
  /**
   * Event emitted when form is submitted.
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  sessionPostalCode?: string
}

const OutOfStock = ({
  testId = 'fs-out-of-stock',
  title,
  titleSession,
  buttonText,
  buttonSuccess,
  inputLabel,
  notificationMsg,
  onSubmit,
  sessionPostalCode,
  ...otherProps
}: OutOfStockProps) => {
  const defaultButtonText = buttonText

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
      onSubmit(email)
      setBtnText(buttonSuccess)
    } catch (err: any) {
      setError(err.message)
    } finally {
      // Return to original state after 2s
      setTimeout(reset, 2000)
    }
  }

  return (
    <section data-fs-out-of-stock data-testid={testId}>
      <form data-out-of-stock-form {...otherProps}>
        <OutOfStockTitle data-fs-out-of-stock-title>
          {(title = sessionPostalCode ? titleSession : title)}
        </OutOfStockTitle>
        {notificationMsg && (
          <p data-fs-out-of-stock-message>
            <Icon component={<BellRinging size={16} />} />
            {notificationMsg}
          </p>
        )}
        <InputField
          id="out-of-stock-email"
          value={email}
          label={inputLabel}
          aria-label={inputLabel}
          error={error}
          onChange={(e) => {
            setError('')
            setEmail(e.target.value)
          }}
        />
        <Button
          data-fs-out-of-stock-button
          type="submit"
          disabled={disabled}
          variant="primary"
          icon={<BellRinging />}
          iconPosition="left"
          onSubmit={handleSubmit}
        >
          {btnText}
        </Button>
      </form>
    </section>
  )
}

export default OutOfStock
