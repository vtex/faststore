import type { CommertialOffer } from '@faststore/api'

export type EnhancedCommercialOffer<S, P> = CommertialOffer & {
  seller: S
  product: P
}

export const enhanceCommercialOffer = <S, P>({
  offer,
  seller,
  product,
}: {
  offer: CommertialOffer
  seller: S
  product: P
}): EnhancedCommercialOffer<S, P> => ({
  ...offer,
  product,
  seller,
})
