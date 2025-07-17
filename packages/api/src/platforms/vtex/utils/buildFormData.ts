export const buildFormData = (
  valueObject: Record<string, string | number | boolean | null | undefined>
) => {
  const form = new FormData()

  Object.keys(valueObject).forEach((key) => {
    const value = valueObject[key]
    form.append(key, value == null ? '' : String(value))
  })

  return form
}
