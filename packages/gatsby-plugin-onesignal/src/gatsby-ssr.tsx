import React from 'react'
import type { RenderBodyArgs } from 'gatsby'

import type { PluginOptions } from './gatsby-node'

export function onRenderBody(
  { setHeadComponents }: RenderBodyArgs,
  pluginOptions: PluginOptions
) {
  if (process.env.NODE_ENV !== `production`) {
    return null
  }

  const { oneSignalAppId } = pluginOptions

  setHeadComponents([
    <link
      rel="preconnect dns-prefetch"
      key="preconnect-onesignal"
      href="https://cdn.onesignal.com"
    />,
  ])

  return setHeadComponents([
    <script
      key="gatsby-plugin-onesignal-cdn"
      src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
      async
    />,
    <script
      key="gatsby-plugin-onesignal"
      dangerouslySetInnerHTML={{
        __html: `
             var OneSignal = window.OneSignal || [];
             OneSignal.push(function() {
                 OneSignal.init({
                 appId: "${oneSignalAppId}",
                 });
             });
         `,
      }}
    />,
  ])
}
