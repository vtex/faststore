import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

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

      <h1>Not Found: 404</h1>
      <div>This app could not find url {fromUrl}</div>
    </>
  )
}

export default Page
