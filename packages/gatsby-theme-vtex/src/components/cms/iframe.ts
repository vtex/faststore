import { Content, isContent } from '@vtex/gatsby-transformer-vtex-cms'

interface CMSEvent {
  action: 'cmsUpdate'
  currentVariant: Content
}

const isCMSData = (data: any): data is CMSEvent =>
  data && data.action === 'cmsUpdate' && isContent(data.currentVariant)

export const CMS_CONTENT = 'cms-content'

export const setupIframeListener = () => {
  window.addEventListener(
    'message',
    (event) => {
      const { data } = event

      if (isCMSData(data)) {
        const { currentVariant } = data

        localStorage.setItem(CMS_CONTENT, JSON.stringify(currentVariant))
      }
    },
    false
  )
}
