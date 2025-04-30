import { useSearch } from '@faststore/sdk'
import { useEffect, type PropsWithChildren } from 'react'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/navigation'

import type { ProductSummary_ProductFragment } from '@generated/graphql'

import useScreenResize from 'src/sdk/ui/useScreenResize'

interface SentinelProps {
  page: number
  pageSize: number
  title: string
  products: Array<{ node: ProductSummary_ProductFragment }>
}

// Adds/Replaces ?page= to the querystring of the page
const replacePagination = (
  page: string,
  router: ReturnType<typeof useRouter>
) => {
  const url = new URL(window.location.href)

  // In case the page argument already matches the target page
  if (url.searchParams.get('page') === page) {
    return
  }

  // Set ?page= parameter and replace route
  url.searchParams.set('page', page)
  router.replace(url.toString(), { scroll: false })
}

/**
 * Use this component to add a boundary between pages so we can
 * change the current page being viewed on infinite pagination.
 *
 * For more info: https://developers.google.com/search/blog/2014/02/infinite-scroll-search-friendly
 *
 * Also, this component's name is kind of curious. Wikipedia calls is Page Break(https://en.wikipedia.org/wiki/Page_break)
 * however all codes I've seen online use Sentinel
 */
function Sentinel({ page, children }: PropsWithChildren<SentinelProps>) {
  const router = useRouter()
  const { pages } = useSearch()
  const { isMobile } = useScreenResize()
  const { ref, inView } = useInView({ threshold: isMobile ? 0.3 : 0.7 })

  useEffect(() => {
    // Only replace pagination state when infinite scroll
    // state has more than one page being rendered to the screen
    if (inView && pages.length > 1) {
      replacePagination(page.toString(), router)
    }
  }, [pages.length, inView, page])

  return <div ref={ref}>{children}</div>
}

export default Sentinel
