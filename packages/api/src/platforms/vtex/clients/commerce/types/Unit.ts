export interface UnitResponse {
  createdAt: string
  updatedAt: string
  name: string
  path: {
    ids: string
    names: string
  }
  id: string
  customerGroup: string[]
}

export interface ScopesByUnit {
  organizationUnitId: string
  scopes: Array<{
    scope: string
    ids: string[]
  }>
}
