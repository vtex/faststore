import { useOrderQueue } from '@vtex/order-manager'
import { useEffect, useState } from 'react'

export const useOrderQueueStatus = () => {
  const { status: statusRef, listen } = useOrderQueue()
  const [queueStatus, setQueueStatus] = useState<typeof statusRef.current>(
    statusRef.current
  )

  useEffect(() => {
    const unlistenPending = listen('Pending', () => {
      setQueueStatus('Pending')
    })

    const unlistenFulfilled = listen('Fulfilled', () => {
      setQueueStatus('Fulfilled')
    })

    return () => {
      unlistenFulfilled()
      unlistenPending()
    }
  }, [listen, setQueueStatus])

  return queueStatus
}
