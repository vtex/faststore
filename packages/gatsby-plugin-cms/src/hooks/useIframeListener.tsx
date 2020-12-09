import { useEffect } from 'react'

import { isContent } from '../common'
import { CMS_CONTENT } from '../utils/constants'
import type { Content } from '../common'

interface CMSEvent {
  action: 'cmsUpdate'
  currentVariant: Content
}

const isCMSData = (data: any): data is CMSEvent =>
  data && data.action === 'cmsUpdate' && isContent(data.currentVariant)

export const useIframeListener = () =>
  useEffect(() => {
    const cb = (event: any) => {
      const { data } = event

      if (isCMSData(data)) {
        const { currentVariant } = data

        localStorage.setItem(CMS_CONTENT, JSON.stringify(currentVariant))
      }
    }

    window.addEventListener('message', cb)

    return () => window.removeEventListener('message', cb)
  }, [])
