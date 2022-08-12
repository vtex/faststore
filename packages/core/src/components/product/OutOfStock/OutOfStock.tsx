import {
  OutOfStock as UIOutOfStock,
  OutOfStockTitle as UIOutOfStockTitle,
  OutOfStockMessage as UIOutOfStockMessage,
} from '@faststore/ui'
import { useState } from 'react'
import type { ReactElement, FormEvent } from 'react'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import InputText from 'src/components/ui/InputText'
import styles from 'src/components/product/OutOfStock/out-of-stock.module.scss'
import { useSession } from 'src/sdk/session'

export interface OutOfStockProps {
  /**
   * The Out of Stock Section's title.
   */
  title?: string
  /**
   * The button text.
   */
  buttonText?: string
  /**
   * Message describing when the user will be notified.
   */
  notificationMsg?: string
  /**
   * Icon displayed inside the button.
   * @default <Icon name="BellRinging" />
   */
  buttonIcon?: ReactElement
  /**
   * Icon displayed inside the notification message.
   * @default <Icon name="BellRinging" />
   */
  notificationMsgIcon?: ReactElement
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Event emitted when form is submitted.
   */
  onSubmit: (value: string) => void
}

function OutOfStock(props: OutOfStockProps) {
  const { postalCode } = useSession()

  const defaultButtonText = 'Notify me'
  const defaultIconName = 'BellRinging'

  const [btnText, setBtnText] = useState(defaultButtonText)
  const [buttonIconName, setButtonIconName] = useState(defaultIconName)
  const [disabled, setDisabled] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const {
    title = postalCode ? 'Unavailable in Your Location' : 'Out of Stock',
    notificationMsg = 'Notify me when available',
    buttonText = btnText,
    buttonIcon = <Icon name={buttonIconName} width={16} height={16} />,
    notificationMsgIcon = (
      <Icon name={defaultIconName} width={16} height={16} />
    ),
    onSubmit,
  } = props

  const reset = () => {
    setButtonIconName(defaultIconName)
    setBtnText(defaultButtonText)
    setDisabled(false)

    setEmail('')
    setError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    setDisabled(true)
    setButtonIconName('Ellipsis')

    try {
      onSubmit(email)
      setButtonIconName('Checked')
      setBtnText('Subscribed successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      // Return to original state after 2s
      setTimeout(reset, 2000)
    }
  }

  return (
    <UIOutOfStock
      data-fs-out-of-stock
      className={styles.fsOutOfStock}
      onSubmit={handleSubmit}
    >
      <UIOutOfStockTitle data-fs-out-of-stock-title>{title}</UIOutOfStockTitle>
      <UIOutOfStockMessage data-fs-out-of-stock-message>
        {notificationMsgIcon} {notificationMsg}
      </UIOutOfStockMessage>
      <InputText
        id="out-of-stock-email"
        value={email}
        label="Email"
        aria-label="Email"
        error={error}
        onChange={(e) => {
          setError('')
          setEmail(e.target.value)
        }}
      />
      <Button
        data-store-out-of-stock-button
        type="submit"
        disabled={disabled}
        variant="primary"
        icon={buttonIcon}
        iconPosition="left"
      >
        {buttonText}
      </Button>
    </UIOutOfStock>
  )
}

export default OutOfStock
