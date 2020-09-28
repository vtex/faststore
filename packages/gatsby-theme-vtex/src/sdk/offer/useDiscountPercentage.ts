interface Offer {
  price: number
  listPrice: number
}

export const useDiscountPercentage = (offer: Offer) => {
  const relation = Math.round((offer.price / offer.listPrice) * 100)

  return 100 - relation
}
