import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { EmptyState as UIEmptyState, Icon as UIIcon } from '@faststore/ui'

const useErrorState = () => {
  const router = useRouter()
  const { from } = router.query
  const { pathname } = router

  return {
    fromUrl: from ?? pathname,
  }
}

function Page() {
  const { fromUrl } = useErrorState()

  return (
    <>
      <NextSeo noindex nofollow />

      <UIEmptyState
        title="Not Found: 404"
        titleIcon={
          <UIIcon
            name="CircleWavyWarning"
            width={56}
            height={56}
            weight="thin"
          />
        }
        bkgColor="light"
      >
        <p>This app could not find url {fromUrl}</p>
      </UIEmptyState>
    </>
  )
}

export default Page
