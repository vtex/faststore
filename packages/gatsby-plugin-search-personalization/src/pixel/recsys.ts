import type { CartProduct } from '@biggy/recsys/event/types/base/cart-event'
import type { PageCategoryData } from '@biggy/recsys/event/types/datalayer/datalayer-page-category'
import type { PageCategoryClickData } from '@biggy/recsys/event/types/datalayer/datalayer-page-category-click'
import type { OrderProduct } from '@biggy/recsys/event/types/page/confirmation'
import type { ProductViewData } from '@biggy/recsys/event/types/datalayer/datalayer-product-view'
import type { SearchQueryData } from '@biggy/recsys/event/types/datalayer/datalayer-search-query'
import type { SearchClickData } from '@biggy/recsys/event/types/datalayer/datalayer-search-click'
import { SessionCartAddEvent } from '@biggy/recsys/event/types/session/cart-add'
import { SessionCartRemoveEvent } from '@biggy/recsys/event/types/session/cart-remove'
import { PageCartEvent } from '@biggy/recsys/event/types/page/cart'
import { DataLayerPageCategoryEvent } from '@biggy/recsys/event/types/datalayer/datalayer-page-category'
import { DataLayerPageCategoryClickEvent } from '@biggy/recsys/event/types/datalayer/datalayer-page-category-click'
import { PageConfirmationEvent } from '@biggy/recsys/event/types/page/confirmation'
import { DataLayerProductViewEvent } from '@biggy/recsys/event/types/datalayer/datalayer-product-view'
import { DataLayerSearchQueryEvent } from '@biggy/recsys/event/types/datalayer/datalayer-search-query'
import { DataLayerSearchClickEvent } from '@biggy/recsys/event/types/datalayer/datalayer-search-click'

export const searchQuery = async (data: SearchQueryData): Promise<void> => {
  await new DataLayerSearchQueryEvent(data).push()
}

export const searchClick = async (data: SearchClickData): Promise<void> => {
  await new DataLayerSearchClickEvent(data).push()
}

export const productView = async (data: ProductViewData): Promise<void> => {
  await new DataLayerProductViewEvent(data).push()
}

export const categoryView = async (data: PageCategoryData): Promise<void> => {
  await new DataLayerPageCategoryEvent(data).push()
}

export const categoryClick = async (
  data: PageCategoryClickData
): Promise<void> => {
  await new DataLayerPageCategoryClickEvent(data).push()
}

export const addToCart = async (
  data: CartProduct[],
  locale?: string
): Promise<void> => {
  await new SessionCartAddEvent(locale).withProducts(data).push()
}

export const removeFromCart = async (
  data: CartProduct[],
  locale?: string
): Promise<void> => {
  await new SessionCartRemoveEvent(locale).withProducts(data).push()
}

export const cartView = async (
  data: CartProduct[],
  locale?: string
): Promise<void> => {
  await new PageCartEvent(locale).withProducts(data).push()
}

export const orderConfirmation = async (
  order: string,
  products: OrderProduct[],
  locale?: string
): Promise<void> => {
  await new PageConfirmationEvent(order, locale).withProducts(products).push()
}
