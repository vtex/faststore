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
    window.location.href = `${storeConfig.loginUrl}${window.location.search}`
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
