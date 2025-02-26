export interface ProductReview {
  id: string
  productId: string
  rating: number
  title: string
  text: string
  reviewerName: string
  shopperId: string
  reviewDateTime: string
  searchDate: string
  verifiedPurchaser: boolean
  sku: string | null
  approved: boolean
  location: string | null
  locale: string | null
  pastReviews: string | null
}

export enum ListProductReviewsInputOrderBy {
  productId = 'ProductId',
  shopperId = 'ShopperId',
  approved = 'Approved',
  reviewDateTime = 'ReviewDateTime',
  searchDate = 'SearchDate',
  rating = 'Rating',
  locale = 'Locale',
}

export type ListProductReviewsInputOrderWay = 'asc' | 'desc'

export interface ListProductReviewsInput {
  searchTerm?: string
  from?: number
  to?: number
  orderBy?: ListProductReviewsInputOrderBy
  orderWay?: ListProductReviewsInputOrderWay
  status?: boolean
  productId?: string
  rating?: number
}

export interface ListProductReviewsResult {
  data: ProductReview[]
  range: {
    from: number
    to: number
    total: number
  }
}

export interface CreateProductReviewInput {
  productId: string
  rating: number
  title: string
  text: string
  reviewerName: string
  approved: boolean
}
