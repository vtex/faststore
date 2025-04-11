import type { ProductSummary_ProductFragment } from '@generated/graphql'

const sentItems = new Set<string>()
let pendingItems: { node: ProductSummary_ProductFragment }[] = []
let debounceTimeout: NodeJS.Timeout | null = null

type QueueViewItemListProps = {
  product: ProductSummary_ProductFragment
  sendViewItemListEvent: (props: {
    products: Array<{ node: ProductSummary_ProductFragment }>
  }) => void
}

export function queueViewItemList({
  product,
  sendViewItemListEvent,
}: QueueViewItemListProps) {
  if (sentItems.has(product.id)) return

  sentItems.add(product.id)
  pendingItems.push({ node: product })

  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    if (pendingItems.length > 0) {
      sendViewItemListEvent({ products: pendingItems })
      pendingItems = []
    }
  }, 300)
}
