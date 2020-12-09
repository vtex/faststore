import { useEffect, useState } from 'react'

import type { SearchHistory } from './controller'

const loadController = () => import('./controller')

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistory | null>(null)

  useEffect(() => {
    loadController().then((controller) => {
      setHistory(controller.history)
    })
  }, [])

  return history
}
