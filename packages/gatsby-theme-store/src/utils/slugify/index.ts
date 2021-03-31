import charMap from './charmap.json'

export const slugify = (term: string) =>
  term
    // remove case
    .toLowerCase()
    // replace accentuation
    .split('')
    .map(
      (char) => (charMap as Record<string, string | undefined>)[char] ?? char
    )
    .join('')
