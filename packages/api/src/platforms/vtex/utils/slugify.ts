import rawSlugify from '@sindresorhus/slugify'

export const slugify = (path: string) =>
  rawSlugify(path, { separator: '-', lowercase: true })
