import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { GetStaticProps } from 'next'
import { Locator } from '@vtex/client-cms'

import { Icon as UIIcon } from '@faststore/ui'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

const useErrorState = () => {
  const router = useRouter()
  const { pathname, asPath } = router

  return {
    fromUrl: asPath ?? pathname,
  }
}

type Props = {
  globalSections: GlobalSectionsData
}

function Page({ globalSections }: Props) {
  const { EmptyState: EmptyStateWrapper } =
    useOverrideComponents<'EmptyState'>()
  const { fromUrl } = useErrorState()

  return (
    <GlobalSections {...globalSections}>
      <NextSeo noindex nofollow />

      <EmptyStateWrapper.Component
        title={`${EmptyStateWrapper.props.title ?? 'Not Found: 404'}`}
        titleIcon={
          <UIIcon
            name="CircleWavyWarning"
            width={56}
            height={56}
            weight="thin"
          />
        }
        {...EmptyStateWrapper.props}
      >
        <p>This app could not find url {fromUrl}</p>
      </EmptyStateWrapper.Component>
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
