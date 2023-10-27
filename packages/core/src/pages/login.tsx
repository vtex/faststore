import { useEffect } from 'react'
import { NextSeo } from 'next-seo'

import storeConfig from '../../faststore.config'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { GetStaticProps } from 'next'
import { Locator } from '@vtex/client-cms'

import { Loader as UILoader } from '@faststore/ui'
import EmptyState from 'src/components/sections/EmptyState'

type Props = {
  globalSections: GlobalSectionsData
}

function Page({ globalSections }: Props) {
  useEffect(() => {
    const loginUrl = new URL(storeConfig.loginUrl)
    const incomingParams = new URLSearchParams(window.location.search)

    for (const [key, value] of Array.from(incomingParams)) {
      loginUrl.searchParams.append(key, value)
    }

    window.location.href = loginUrl.toString()
  }, [])

  return (
    <GlobalSections {...globalSections}>
      <NextSeo noindex nofollow />

      <EmptyState title="Loading">
        <UILoader />
      </EmptyState>
    </GlobalSections>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const globalSections = await getGlobalSectionsData(previewData)

  return {
    props: { globalSections },
  }
}

export default Page
