import { useEffect } from 'react'

import { Toast as UIToast, useUI } from '@faststore/ui'
import Section from 'src/components/sections/Section/Section'
import { useCart } from 'src/sdk/cart'

function Toast() {
  const { toasts, pushToast } = useUI()
  const { messages } = useCart()

  /**
   * Send cart notifications to toast in case the cart
   * returns warnings
   */
  useEffect(() => {
    if (!messages) {
      return
    }

    messages.forEach((message) =>
      pushToast({
        message: message.text,
        status: message.status,
      })
    )
  }, [messages, pushToast])

  return (
    <>
      {toasts.length > 0 && (
        <Section className={`section-toast`}>
          <UIToast />
        </Section>
      )}
    </>
  )
}

export default Toast
