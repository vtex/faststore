import rawSlugify from 'slugify'

export const slugify = (path: string) =>
  rawSlugify(path, { replacement: '-', lower: true })
