/**
 * Whether a product request failed because the product is not available to
 * the shopper. A non-2xx BFF response reaches the client as `{ status }` (see
 * `ParseInvalidRequest`), while a 2xx one keeps the GraphQL `extensions`.
 */
export const isProductNotFound = (error: unknown) => {
  const { status, extensions } = (error ?? {}) as {
    status?: number
    extensions?: { type?: string }
  }

  return status === 404 || extensions?.type === 'NotFoundError'
}
