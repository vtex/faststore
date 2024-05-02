import { usePagination as usePaginationSDK } from '@faststore/sdk'
import { useEffect, useState } from 'react'

export const useDelayedPagination = (totalCount: number) => {
  const pagination = usePaginationSDK(totalCount)
  const [pag, setPag] = useState<typeof pagination>(() => ({
    next: false,
    prev: false,
  }))

  useEffect(() => {
    setPag(pagination)
  }, [pagination])

  return pag
}
