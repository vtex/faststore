import { ServerProductQueryQuery } from '@generated/graphql'
import { PDPContentType } from 'src/server/cms/pdp'
import { PLPContentType } from 'src/server/cms/plp'

export type Rewrite = {
  source: string
  destination: string
}

export type RewritesConfig = {
  beforeFiles?: Rewrite[]
  afterFiles?: Rewrite[]
  fallback?: Rewrite[]
}

export function normalizePLPSlug(slug: string) {
  // Remove extra slashes at the beginning and end
  let normalizedSlug = slug.replace(/^\/+|\/+$/g, '')

  // Remove duplicate slashes and white spaces throughout the string
  normalizedSlug = normalizedSlug.replace(/\/+/g, '/').replace(/\s+/g, '')

  return '/' + normalizedSlug.toLowerCase()
}

function findPLPTemplateBySlug(
  pages: Partial<PLPContentType>[],
  slug: string,
  rewrites: Rewrite[] | RewritesConfig
) {
  return pages.find((page) => {
    // generic PLP template
    if (!page.settings?.template?.value) return false

    const templateValue = normalizePLPSlug(page.settings?.template?.value)
    return (
      templateValue === slug ||
      hasRewritesConfigForSlug({ rewrites, templateValue, slug })
    )
  })
}

/**
 *  Normalizes the rewrites object, and returns:
 *  true if the templateValue from hCMS passed as param match the source value from the rewrites object AND the slug match the destination.
 *  see https://nextjs.org/docs/app/api-reference/next-config-js/rewrites
 * @param rewrites
 * @param templateValue
 * @param slug
 * @returns boolean indicating if the slug exist as a rewrite destination
 */
export function hasRewritesConfigForSlug({
  rewrites,
  templateValue,
  slug,
}: {
  rewrites: Rewrite[] | RewritesConfig
  templateValue: string
  slug: string
}): boolean {
  if (!rewrites) {
    return false
  }

  let allRewrites: Rewrite[] = []

  if (Array.isArray(rewrites)) {
    allRewrites = rewrites
  } else {
    allRewrites = [
      ...(rewrites?.beforeFiles || []),
      ...(rewrites?.afterFiles || []),
      ...(rewrites?.fallback || []),
    ]
  }

  const foundRewrite = allRewrites.find(
    (rewriteConfig) =>
      rewriteConfig.source === templateValue &&
      rewriteConfig.destination === slug
  )
  return Boolean(foundRewrite)
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
  pages: Partial<PLPContentType>[],
  originalSlug: string,
  rewrites: Rewrite[] | RewritesConfig
) {
  let slug = normalizePLPSlug(originalSlug)
  let foundPageTemplate = findPLPTemplateBySlug(pages, slug, rewrites)

  while (!foundPageTemplate && slug.lastIndexOf('/') !== -1) {
    slug = slug.substring(0, slug.lastIndexOf('/'))
    foundPageTemplate = findPLPTemplateBySlug(pages, slug, rewrites)
  }

  return (
    foundPageTemplate ||
    pages.find((page) => !page.settings?.template?.value) ||
    pages[0]
  )
}

export function normalizePDPTemplate(templateValue: string) {
  // Remove extra slashes, white spaces at the beginning and end
  let formattedValue = templateValue.trim().replace(/^\/+|\/+$/g, '')

  // Add a slash at the beginning if not present
  if (!formattedValue.startsWith('/')) {
    formattedValue = '/' + formattedValue
  }

  // Add a slash at the end if not ending with '/p'
  if (!formattedValue.endsWith('/p')) {
    formattedValue += '/'
  }

  // Remove duplicate slashes and white spaces throughout the string
  formattedValue = formattedValue.replace(/\/+/g, '/').replace(/\s+/g, '')

  return formattedValue.toLowerCase()
}

// Returns an array of slugs without the number at the end ("-{number}/p") at each interaction if it matches, otherwise returns the slug as is.
const getSlugsWithoutSkuIdFromPDP = (slug: string) => {
  const slugs = []
  let currentSlug = slug
  let match = currentSlug.match(/-\d+\/p$/)

  while (match) {
    const newSlug = currentSlug.replace(/-\d+\/p$/, '/p')
    slugs.push(newSlug)
    currentSlug = newSlug
    match = currentSlug.match(/-\d+\/p$/)
  }

  return slugs
}

/**
 * Find the best PDP template from the CMS based on the slug or in the product category tree.
 * Prioritizing the following order:
 *
 * 1. A PDP template that matches the page slug with skuId (e.g. slug = /apple-magic-mouse-12345/p).
 * 2. A PDP template that matches the page slug (e.g. slug = /apple-magic-mouse/p).
 * 3. A PDP template that matches the product subcategory (e.g. /department/category/subcategory).
 * 4. A PDP template that matches the product category (e.g. /department/category).
 * 5. A PDP template that matches the product department (e.g. /department).
 * 6. If no matches are found, use the generic PDP template.
 *
 * @param pages
 * @param product
 * @returns The best PDP template page for the product
 */
export function findBestPDPTemplate(
  pages: Partial<PDPContentType>[],
  product: ServerProductQueryQuery['product']
) {
  const templateValues = getPDPTemplateValues({
    itemListElement: product.breadcrumbList.itemListElement ?? [],
  })

  for (const template of templateValues) {
    for (const page of pages) {
      if (!page.settings?.template?.value) continue

      const templateValueFromCms = normalizePDPTemplate(
        page.settings.template.value
      )
      if (templateValueFromCms === template) {
        return page
      }
    }
  }

  return pages.find((page) => !page.settings?.template?.value) || pages[0]
}

export function getPDPTemplateValues({
  itemListElement = [],
}: {
  itemListElement: ServerProductQueryQuery['product']['breadcrumbList']['itemListElement']
}) {
  // productSlugAndCategoryTree with the prioritized order. [link-skuId/p, subcategory tree, category tree, department]
  const productSlugAndCategoryTree = [...itemListElement]
    .reverse()
    .map(({ item }) => item)

  // PDP slug comes from FastStore API with the format `${link}-${skuId}/p`, the most specific for multiple page templates,
  // so it should be the first element
  const slugWithSkuId = productSlugAndCategoryTree[0]

  // PDP slug without skuId `${link}/p`, should be the second element
  const slugsWithoutSkuId = getSlugsWithoutSkuIdFromPDP(slugWithSkuId)

  // removes duplicated and undefined
  return [
    slugWithSkuId,
    ...slugsWithoutSkuId,
    ...productSlugAndCategoryTree.slice(1),
  ].filter((item, index, arr) => item && arr.indexOf(item) === index)
}
