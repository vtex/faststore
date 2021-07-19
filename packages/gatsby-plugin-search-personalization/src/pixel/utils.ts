export const decodeTerm = (term?: string) => {
  try {
    return term ? decodeURI(term) : term
  } catch (e) {
    return term
  }
}

export const getTerm = ({
  map = '',
  query = '',
}: {
  map?: string
  query?: string
}): string | undefined => {
  const termIndex = map?.split(',').indexOf('ft')

  return query?.split('/')[termIndex]
}
