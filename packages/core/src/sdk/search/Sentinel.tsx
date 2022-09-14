import { useSearch } from '@faststore/sdk'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'

import type { ProductSummary_ProductFragment } from '@generated/graphql'

import { useViewItemListEvent } from '../analytics/hooks/useViewItemListEvent'

interface Props {
  page: number
  pageSize: number
  title: string
  products: Array<{ node: ProductSummary_ProductFragment }>
}

// Adds/Replaces ?page= to the querystring of the page
const replacePagination = (page: string, router: NextRouter) => {
  const url = new URL(window.location.href)

  // In case the page argument already matches the target page
  if (url.searchParams.get('page') === page) {
    return
  }

  // Set ?page= parameter and replace route
  url.searchParams.set('page', page)
  router.replace(url, undefined, { shallow: true, scroll: false })
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
function Sentinel({ page, pageSize, products, title }: Props) {
  const viewedRef = useRef(false)
  const { ref, inView } = useInView()
  const { pages } = useSearch()

  const router = useRouter()

  const { sendViewItemListEvent } = useViewItemListEvent({
    products,
    title,
    page,
    pageSize,
  })

  useEffect(() => {
    // Only replace pagination state when infinite scroll
    // state has more than one page being rendered to the screen
    if (inView && pages.length > 1) {
      replacePagination(page.toString(), router)
    }

    if (inView && !viewedRef.current && products.length) {
      sendViewItemListEvent()
      viewedRef.current = true
    }
  }, [
    pages.length,
    inView,
    page,
    router,
    sendViewItemListEvent,
    products.length,
  ])

  return <div ref={ref} />
}

export default Sentinel
