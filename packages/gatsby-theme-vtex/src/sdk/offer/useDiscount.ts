interface Offer {
  price: number
  listPrice: number
}

export const useDiscount = ({ price, listPrice }: Offer) => {
  if (listPrice === 0) {
    return 0
  }

  return 100 - Math.round((price / listPrice) * 100)
}
