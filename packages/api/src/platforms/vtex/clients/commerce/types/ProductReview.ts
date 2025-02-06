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

export enum ProductReviewsInputOrderBy {
  productId = 'ProductId',
  shopperId = 'ShopperId',
  approved = 'Approved',
  reviewDateTime = 'ReviewDateTime',
  searchDate = 'SearchDate',
  rating = 'Rating',
  locale = 'Locale',
}

export interface ProductReviewsInput {
  searchTerm?: string
  from?: number
  to?: number
  orderBy?: ProductReviewsInputOrderBy
  orderWay?: 'asc' | 'desc'
  status?: boolean
  productId?: string
  rating?: number
}

export interface ProductReviewsResult {
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
