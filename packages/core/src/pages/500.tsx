import { Locator } from '@vtex/client-cms'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'

import { Icon as UIIcon } from '@faststore/ui'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

type Props = {
  globalSections: GlobalSectionsData
}

const useErrorState = () => {
  const router = useRouter()
  const { errorId, fromUrl } = router.query

  return {
    errorId,
    fromUrl,
  }
}

function Page({ globalSections }: Props) {
  const { errorId, fromUrl } = useErrorState()
  const { EmptyState: EmptyStateWrapper } =
    useOverrideComponents<'EmptyState'>()

  return (
    <GlobalSections {...globalSections}>
      <NextSeo noindex nofollow />

      <EmptyStateWrapper.Component
        title={`${EmptyStateWrapper.props.title ?? '500'}`}
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
        <h2>Internal Server Error</h2>

        <div>
          The server errored with id {errorId} when visiting page {fromUrl}
        </div>
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
