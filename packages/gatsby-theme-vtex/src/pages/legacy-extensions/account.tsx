import { Center, Spinner } from '@vtex/store-ui'
import React, { FC, useEffect, useState } from 'react'

import { useLocale } from '../../sdk/localization/useLocale'
import RenderExtensionLoader from '../../sdk/renderExtensionLoader'

const MY_ACCOUNT_PATH = '/account'
const MY_ACCOUNT_DIV_NAME = 'my-account'
const MY_ACCOUNT_EXTENSION_NAME = 'my-account-portal'
const ONE_MIN_IN_MILLI = 60 * 100

const render = async (locale: string) => {
  const loader = new RenderExtensionLoader({
    account: process.env.GATSBY_VTEX_TENANT,
    workspace: process.env.GATSBY_VTEX_IO_WORKSPACE,
    verbose: process.env.NODE_ENV !== 'production',
    publicEndpoint: undefined,
    timeout: ONE_MIN_IN_MILLI,
    path: MY_ACCOUNT_PATH,
    locale,
  })

  const myAccountDiv = document.getElementById(MY_ACCOUNT_DIV_NAME)

  if (window.__RENDER_7_RUNTIME__) {
    loader.render(MY_ACCOUNT_EXTENSION_NAME, myAccountDiv, undefined)

    return
  }

  await loader.load()

  window.__RUNTIME__ = loader.render(
    MY_ACCOUNT_EXTENSION_NAME,
    myAccountDiv,
    undefined
  )
}

const Loading: FC = () => (
  <Center height="750px">
    <Spinner />
  </Center>
)

const Page: FC = () => {
  const [loading, setLoading] = useState(true)
  const locale = useLocale()

  useEffect(() => {
    ;(async () => {
      try {
        await render(locale)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [locale])

  return (
    <>
      <div id={MY_ACCOUNT_DIV_NAME} />
      {loading && <Loading />}
    </>
  )
}

export default Page
