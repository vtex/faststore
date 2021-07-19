export interface RecsysProviderProps {
  allowedHosts?: string[]
}

export interface CartItem {
  skuId?: string
  price: number
  skuName?: string
  productName?: string
  quantity: number
  productReferenceId?: string | null
  brand?: string
  productId?: string
}

export interface OrderProduct {
  product: string
  price: number
  quantity: number
}
