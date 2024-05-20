import type { Rewrite, RewritesConfig } from '../../src/utils/multipleTemplates'
import {
  getPDPTemplateValues,
  hasRewritesConfigForSlug,
} from '../../src/utils/multipleTemplates'

const productItemListElementMock = [
  { item: '/department/', name: 'test', position: 1 }, // Department
  { item: '/department/category/', name: 'test', position: 1 }, // Category tree
  { item: '/department/category/subcategory/', name: 'test', position: 1 }, // Subcategory tree
  {
    item: '/department/category/subcategory/subcategory2/',
    name: 'test',
    position: 1,
  }, // Subcategory tree tree
  {
    item: '/department/category/subcategory/subcategory2/subcategory3/',
    name: 'test',
    position: 1,
  }, // Subcategory tree
  { item: '/slug-product-test-111111-2222/p', name: 'test', position: 1 }, // PDP slug with skuId
]

describe('Multiple page templates', () => {
  describe('PLP hasRewritesConfigForSlug', () => {
    it('should return true when rewrites is an array of objects containing the desired destination and source', () => {
      const rewritesArr: Rewrite[] = [
        { source: '/test/my-office', destination: '/office' },
      ]
      const result = hasRewritesConfigForSlug({
        rewrites: rewritesArr,
        templateValue: '/test/my-office',
        slug: '/office',
      })
      expect(result).toBe(true)
    })

    it('should return true when rewrites is an object with three arrays containing the desired destination and source', () => {
      const rewritesObj: RewritesConfig = {
        beforeFiles: [{ source: '/test/my-office', destination: '/office' }],
        afterFiles: [],
        fallback: [],
      }
      const result = hasRewritesConfigForSlug({
        rewrites: rewritesObj,
        templateValue: '/test/my-office',
        slug: '/office',
      })
      expect(result).toBe(true)
    })

    it('should return false when the desired source is found but the destination is different', () => {
      const rewritesArr: Rewrite[] = [
        { source: '/test/my-office', destination: '/home' },
      ]
      const result = hasRewritesConfigForSlug({
        rewrites: rewritesArr,
        templateValue: '/test/my-office',
        slug: '/office',
      })
      expect(result).toBe(false)
    })

    it('should return false when the rewrites is empty array', () => {
      const rewritesArr = []
      const result = hasRewritesConfigForSlug({
        rewrites: rewritesArr,
        templateValue: '/test/my-office',
        slug: '/office',
      })
      expect(result).toBe(false)
    })

    it('should return false when the desired destination is found but the source is different', () => {
      const rewritesArr: Rewrite[] = [
        { source: '/test/my-home', destination: '/office' },
      ]
      const result = hasRewritesConfigForSlug({
        rewrites: rewritesArr,
        templateValue: '/test/my-office',
        slug: '/office',
      })
      expect(result).toBe(false)
    })
  })

  describe('PDP getPDPTemplateValues', () => {
    it('should return correct template values when PDP slug has skuId', () => {
      const result = getPDPTemplateValues({
        slug: '/slug-product-test-111111-2222/p',
        itemListElement: productItemListElementMock,
      })
      expect(result).toEqual([
        '/slug-product-test-111111-2222/p', // PDP slug with skuId
        '/slug-product-test-111111/p', // PDP slug without skuId
        '/department/category/subcategory/subcategory2/subcategory3/', // Subcategory tree
        '/department/category/subcategory/subcategory2/', //  Subcategory tree
        '/department/category/subcategory/', // Subcategory
        '/department/category/', // Category
        '/department/', // Department
      ])
    })

    it('should return correct template values when PDP slug does not have skuId', () => {
      const result = getPDPTemplateValues({
        slug: '/slug-product-test-111111/p',
        itemListElement: productItemListElementMock,
      })
      expect(result).toEqual([
        '/slug-product-test-111111-2222/p', // PDP slug with skuId
        '/slug-product-test-111111/p', // PDP slug without skuId
        '/department/category/subcategory/subcategory2/subcategory3/', // Subcategory tree
        '/department/category/subcategory/subcategory2/', //  Subcategory tree
        '/department/category/subcategory/', // Subcategory
        '/department/category/', // Category
        '/department/', // Department
      ])
    })

    it('should return the PDPs slugs with and without skuId when itemListElement is undefined and slug has skuId', () => {
      const result = getPDPTemplateValues({
        slug: '/slug-product-test-111111-2222/p',
        itemListElement: undefined,
      })
      expect(result).toEqual([
        '/slug-product-test-111111-2222/p',
        '/slug-product-test-111111/p',
      ])
    })

    it('should return the PDPs slug with skuId when itemListElement is undefined and slug do not have skuId', () => {
      const result = getPDPTemplateValues({
        slug: '/slug-product-test-111111/p',
        itemListElement: undefined,
      })
      expect(result).toEqual(['/slug-product-test-111111/p'])
    })
  })
})
