interface Offer {
  price: number
  listPrice: number
}

export const useDiscountPercentage = ({ price, listPrice }: Offer) => {
  const relation = listPrice !== 0 ? Math.round((price / listPrice) * 100) : 100

  return 100 - relation
}
