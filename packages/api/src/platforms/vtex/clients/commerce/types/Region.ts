export interface RegionInput {
  postalCode: string
  country: string
  salesChannel?: string | null
}

export type Region = Array<{ id: string }>
