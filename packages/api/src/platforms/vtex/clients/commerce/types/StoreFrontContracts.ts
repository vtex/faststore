/** `GET /_v/store-front/units/{orgUnitId}/contracts/attached` (buyer-portal-graphql). */
export type AttachedContract = {
  id: string
  name?: string | null
  /** Not emitted by the BFF today; honored when present. The BFF lists the default first. */
  isDefault?: boolean
}

export type AttachedContractsResponse = {
  contracts: AttachedContract[]
}
