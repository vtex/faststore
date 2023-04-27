import { useEffect } from 'react'
import { NextSeo } from 'next-seo'

import storeConfig from '../../faststore.config'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { GetStaticProps } from 'next'
import { Locator } from '@vtex/client-cms'

type Props = {
  globalSections: GlobalSectionsData
}

function Page({ globalSections }: Props) {
  useEffect(() => {
    window.location.href = storeConfig.checkoutUrl
  }, [])

  return (
    <GlobalSections {...globalSections}>
      <NextSeo noindex nofollow />

      <div>loading...</div>
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
