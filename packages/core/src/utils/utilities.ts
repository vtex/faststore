import { PLPContentType } from 'src/server/cms'

//Input "Example Text!". Output: example-text
export function textToKebabCase(text: string): string {
  // Replace spaces and special characters with hyphens
  let kebabCase = text.replace(/[^\w\s]/gi, '-')

  // Remove whitespace
  kebabCase = kebabCase.replace(/\s+/g, '-')

  // Convert to lowercase
  kebabCase = kebabCase.toLowerCase()

  return kebabCase ?? ''
}

export function normalizePLPSlug(slug: string) {
  // Remove extra slashes at the beginning and end
  let normalizedSlug = slug.replace(/^\/+|\/+$/g, '')
  return '/' + normalizedSlug.toLowerCase()
}

function findPLPTemplateBySlug(pages: PLPContentType[], slug: string) {
  return pages.find((page) => {
    // general PLP template
    if (!page.settings?.template?.value) return false

    const templateValue = normalizePLPSlug(page.settings?.template?.value)
    return templateValue === slug
  })
}

/**
 * Find the best PLP template from the CMS based on the slug passed as param.
 *
 * This function iterates the slug until there is no slashes (/), prioritizing the following order:
 * 1. A PLP template that matches the subcategory (e.g. slug = /department/category/subcategory).
 * 2. A PLP template that matches the category (e.g. slug = /department/category).
 * 3. A PLP template that matches the department (e.g. slug = /department).
 * 4. If no matches are found, use the generic PLP template.
 *
 * @param pages
 * @param originalSlug
 * @returns The best PLP template page for the slug
 */
export function findBestPLPTemplate(
  pages: PLPContentType[],
  originalSlug: string
) {
  let slug = normalizePLPSlug(originalSlug)
  let foundPageTemplate = findPLPTemplateBySlug(pages, slug)

  while (!foundPageTemplate && slug.lastIndexOf('/') !== -1) {
    slug = slug.substring(0, slug.lastIndexOf('/'))
    foundPageTemplate = findPLPTemplateBySlug(pages, slug)
  }

  return (
    foundPageTemplate || pages.find((page) => page.settings?.template?.value)
  )
}
