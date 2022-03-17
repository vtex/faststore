export interface RegionInput {
  postalCode: string
  country: string
  salesChannel?: number
}

export type Region = Array<{ id: string }>
