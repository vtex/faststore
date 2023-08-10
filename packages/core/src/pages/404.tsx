import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { GetStaticProps } from 'next'
import { Locator } from '@vtex/client-cms'

import { Icon as UIIcon } from '@faststore/ui'
import EmptyState from 'src/components/sections/EmptyState'
import { SectionProvider } from 'src/sdk/ui/SectionContex'

const useErrorState = () => {
  const router = useRouter()
  const { from } = router.query
  const { pathname } = router

  return {
    fromUrl: from ?? pathname,
  }
}

type Props = {
  globalSections: GlobalSectionsData
}

function Page({ globalSections }: Props) {
  const { fromUrl } = useErrorState()

  return (
    <GlobalSections {...globalSections}>
      <SectionProvider globalSections={globalSections.sections}>
        <NextSeo noindex nofollow />

        <EmptyState
          title="Not Found: 404"
          titleIcon={
            <UIIcon
              name="CircleWavyWarning"
              width={56}
              height={56}
              weight="thin"
            />
          }
        >
          <p>This app could not find url {fromUrl}</p>
        </EmptyState>
      </SectionProvider>
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
