import React from 'react'
import { UIProvider } from '@vtex/store-sdk'

import { handleUserBackOnline } from './src/sdk/offline'
import { Provider as RegionProvider } from './src/sdk/region/Provider'
import { Provider as ToastProvider } from './src/sdk/toast/Provider'

export const wrapRootElement = ({ element }) => (
  <UIProvider>
    <RegionProvider>
      <ToastProvider>{element}</ToastProvider>
    </RegionProvider>
  </UIProvider>
)

export const onRenderBody = ({ setPostBodyComponents, pathname }) => {
  if (!pathname.startsWith('/offline')) {
    return null
  }

  // The following `<script>` tag should only be added to an offline page.
  return setPostBodyComponents([
    <script
      key="offline-online-handler"
      dangerouslySetInnerHTML={{
        __html: `
            ${handleUserBackOnline.toString()}

            window.addEventListener('online', handleUserBackOnline)
         `,
      }}
    />,
  ])
}
