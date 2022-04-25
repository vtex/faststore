import { useEffect, useRef } from 'react'

import Button from 'src/components/ui/Button'
import { useUI } from 'src/sdk/ui'

const state = {
  ERROR: 'bg-red',
  WARNING: 'bg-yellow',
  INFO: 'bg-green',
}

function Toast() {
  const { toasts, popToast } = useUI()
  const toast = toasts[toasts.length - 1]
  const ref = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    const id = setTimeout(() => {
      popToast()
    }, 2e3)

    ref.current.push(id)
  }, [popToast])

  if (toast === undefined) {
    return null
  }

  return (
    <div>
      <Button onClick={popToast}>Close</Button>
      <div className={`h-36 text-white ${state[toast.status]}`}>
        message: {toast.message}
      </div>
    </div>
  )
}

export default Toast
