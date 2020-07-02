export interface MetaTag {
  property: string
  content: string
}

export const setMetaTag = (tag: MetaTag) => {
  const { property, content } = tag

  let meta = document.getElementById(property)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('id', property)
    document.getElementsByTagName('head')[0].appendChild(meta)
  }

  meta.setAttribute('property', property)
  meta.setAttribute('content', content)
}
