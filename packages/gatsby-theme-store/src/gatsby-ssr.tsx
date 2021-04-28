import React from 'react'
import type { RenderBodyArgs } from 'gatsby'

import { handleUserBackOnline } from './sdk/offline'

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
