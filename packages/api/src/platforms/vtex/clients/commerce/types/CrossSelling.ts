export interface WhoSawAlsoBoughtProducts {
  productID: string
}

export interface CrossSellingItem {
  productId: string
  type?: 'whoSawAlsoBought'
}
