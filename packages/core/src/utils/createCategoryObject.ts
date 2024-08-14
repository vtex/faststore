export function createCategoryObject(array: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  array.forEach((item, index) => {
    result[`item_category${index ? index + 1 : ''}`] = item
  })
  return result
}
