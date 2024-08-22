import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

import { Locator } from '@vtex/client-cms'
import { GetStaticProps } from 'next'
import {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import RenderSections from 'src/components/cms/RenderSections'
import storeConfig from '../../faststore.config'

type Props = {
  globalSections: GlobalSectionsData
}

function Page({ globalSections }: Props) {
  useEffect(() => {
    window.location.href = `${storeConfig.accountUrl}${window.location.search}`
  }, [])

  return (
    <RenderSections {...globalSections}>
      <NextSeo noindex nofollow />

      <div>loading...</div>
    </RenderSections>
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
