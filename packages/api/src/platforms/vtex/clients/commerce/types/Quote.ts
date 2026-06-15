export interface QuoteSummary {
  id: string
  status: string
  label?: string
  createdAt: string
  expiresAt: string
  amount: number
  createdBy?: string
}

export interface QuoteListResult {
  items: QuoteSummary[]
  pageNumber: number
  pageSize: number
  totalItems: number
}

export interface ListUserQuotesArgs {
  page?: number
  perPage?: number
  status?: string[]
  createdAtFrom?: string
  createdAtTo?: string
  expiresAtFrom?: string
  expiresAtTo?: string
}
