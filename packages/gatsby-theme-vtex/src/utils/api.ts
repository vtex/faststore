export const urls = {
  product: (slug: string) =>
    `/api/catalog_system/pub/products/search/${slug}/p`,
  productsPageByCategory: ({
    categoryId,
    from,
    to,
  }: {
    categoryId: number
    from: number
    to: number
  }) =>
    `/api/catalog_system/pub/products/search?fq=C:${categoryId}&map=c&_from=${from}&_to=${to}`,
}
