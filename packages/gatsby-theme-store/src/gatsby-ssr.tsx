import { UIProvider } from '@vtex/store-sdk'
import React from 'react'
import type { RenderBodyArgs, WrapRootElementNodeArgs } from 'gatsby'

import { handleUserBackOnline } from './sdk/offline'
import { Provider as RegionProvider } from './sdk/region/Provider'
import { Provider as ToastProvider } from './sdk/toast/Provider'

export const wrapRootElement = ({ element }: WrapRootElementNodeArgs) => (
  <UIProvider>
    <RegionProvider>
      <ToastProvider>{element}</ToastProvider>
    </RegionProvider>
  </UIProvider>
)

export const onRenderBody = ({
  setPostBodyComponents,
  pathname,
}: RenderBodyArgs) => {
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
