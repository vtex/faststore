import { useEffect, useRef, useState } from 'react'
import { useWorker, createWorkerFactory } from '@shopify/react-web-worker'

const createWorker = createWorkerFactory(() => import('../../worker/worker'))

export const useRemoteRenderer = () => {
  const worker = useWorker(createWorker)
  const terminated = useRef<Boolean>(false)

  useEffect(() => {
    return () => {
      terminated.current = true
    }
  }, [terminated])

  return terminated.current ? null : worker
}
