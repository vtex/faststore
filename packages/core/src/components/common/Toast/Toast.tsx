import { lazy, Suspense, useEffect } from 'react'

import { useCart } from 'src/sdk/cart'
import { useUI } from 'src/sdk/ui/Provider'

const UIToast = lazy(() => import('src/components/ui/Toast'))

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
        <Suspense fallback={null}>
          <UIToast />
        </Suspense>
      )}
    </>
  )
}

export default Toast
