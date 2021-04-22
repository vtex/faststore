export interface Item {
  id: string
  name: string
  seller: string
  sellingPrice: number
  imageUrls: {
    at1x: string
    at2x: string
    at3x: string
  }
  quantity: number
}
