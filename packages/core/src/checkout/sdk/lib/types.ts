export type NewProduct = {
  name: string
  price: number
  imageUrl: string
  skuName: string
}

export type OrderFormApi = {
  addToCart: (newProduct: NewProduct) => void
}

export type ExtensionPoints =
  | 'AfterProductTitle'
  | 'BeforeCartTitle'
  | 'AfterCartTitle'
  | 'BeforeCartList'
  | 'AfterCartList'
  | 'AfterSummary'
  | 'AfterFinishOrder'
  | 'BeforeSummary'
  | 'CouponButton'
  | 'Footer'
  | 'Root'
