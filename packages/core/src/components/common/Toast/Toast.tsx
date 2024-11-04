import { useEffect } from 'react'

import dynamic from 'next/dynamic'

import { useUI } from '@faststore/ui'
import Section from 'src/components/sections/Section/Section'
import { useCart } from 'src/sdk/cart'
import styles from './section.module.scss'

const UIToast = dynamic(
  () =>
    import(/* webpackChunkName: "UIToast" */ '@faststore/ui').then((module) => {
      return module.Toast
    }),
  { ssr: false }
)

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
        <Section className={`${styles.section} section-toast`}>
          <UIToast />
        </Section>
      )}
    </>
  )
}

export default Toast
