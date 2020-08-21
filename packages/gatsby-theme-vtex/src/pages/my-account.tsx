import React, { useEffect } from 'react'

import RenderExtensionLoader from '../utils/render-extension-loader'

const Account = () => {
  useEffect(() => {
    if (document.getElementById('my-account')?.children.length === 0) {
      const loader = new RenderExtensionLoader({
        account: 'storecomponents',
        workspace: 'icaromyaccount',
        path: '/account',
        locale: 'pt-BR',
        verbose: true,
        publicEndpoint: undefined,
        timeout: 1500000,
      })

      const myAccountIframe = document.getElementById('my-account');

      loader
        .load()
        .then(() => {

          window.__RUNTIME__ = loader.render(
            'my-account-portal',
            myAccountIframe,
            undefined,
          )

          // myAccountIframe.style.height = myAccountIframe.contentWindow!.document.documentElement.scrollHeight + 'px';
        })
        .catch(() => {})
    }
  }, [])

  return <div id="my-account" />
}

export default Account;
