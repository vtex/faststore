export type StoreFrontContractSummary = {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  creationDate?: string | null
  priceTables?: string | null
  isActive?: boolean | null
  tradePolicy?: string | null
  imageUrl?: string | null
}

export type StoreFrontAttachedContractsResponse = {
  ids: string[]
  contracts: StoreFrontContractSummary[]
  total: number
}
