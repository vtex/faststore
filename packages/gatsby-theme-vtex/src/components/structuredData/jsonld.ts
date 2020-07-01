import { Product, Brand } from 'schema-dts'

type StructuredData = Product | Brand // TODO: add more types in here

const TAG_LOCATOR = 'page-structured-data'

// Adds a script tag into the HTML's head
// If the element already exists, it replaces the element's innerHtml
export const writeJsonLD = (data: StructuredData) => {
  let script = document.getElementById(TAG_LOCATOR)
  if (!script) {
    script = document.createElement('script')
    script.setAttribute('id', TAG_LOCATOR)
    script.setAttribute('type', 'application/ld+json')
    document.getElementsByTagName('head')[0].appendChild(script)
  }
  script.innerHTML = JSON.stringify(data)
}
