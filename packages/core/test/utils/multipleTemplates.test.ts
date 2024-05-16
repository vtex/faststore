import type { Rewrite, RewritesConfig } from '../../src/utils/multipleTemplates'
import { hasRewritesConfigForSlug } from '../../src/utils/multipleTemplates'

describe('Multiple page templates', () => {
  describe('hasRewritesConfigForSlug', () => {
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
})
