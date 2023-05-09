import React, { useEffect, useRef, useState } from 'react'

import { useUI } from '../../hooks'

function Toast() {
  const { toasts, popToast } = useUI()
  const toast = toasts[toasts.length - 1]
  const timeoutRef = useRef<NodeJS.Timeout>()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeout = setTimeout(() => setVisible(true), 10)

    return () => clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 6e3)

    return () => timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [toast])

  if (toast === undefined) {
    return null
  }

  return (
    <div
      role="status"
      data-fs-toast
      data-fs-toast-visible={visible}
      onTransitionEnd={() => !visible && popToast()}
    >
      {toast.icon && (
        <div data-fs-toast-icon-container>{!!toast.icon && toast.icon}</div>
      )}
      <div data-fs-toast-content>
        {toast.title && <p data-fs-toast-title>{toast.title}</p>}
        <p data-fs-toast-message>{toast.message}</p>
      </div>
    </div>
  )
}

export default Toast
