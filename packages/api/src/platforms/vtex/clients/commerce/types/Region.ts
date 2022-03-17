export interface RegionInput {
  postalCode: string
  country: string
  salesChannel?: number | null
}

export type Region = Array<{ id: string }>
