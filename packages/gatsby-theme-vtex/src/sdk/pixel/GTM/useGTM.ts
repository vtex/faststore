import { useLazyScript } from '../../lazyScript/useLazyScript'
import { isServer } from '../../../utils/env'

if (!isServer) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
}

export const useGTM = (gtmId: string) =>
  useLazyScript({
    src: `https://www.googletagmanager.com/gtm.js?id=${gtmId}`,
    id: gtmId,
  })
