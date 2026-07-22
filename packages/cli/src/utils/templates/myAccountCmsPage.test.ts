import { describe, expect, it } from 'vitest'

import { myAccountCmsPageTemplate } from './myAccountCmsPage'

describe('myAccountCmsPageTemplate', () => {
  it('emits Mode A output without DynamicPage', () => {
    const output = myAccountCmsPageTemplate({
      contentType: 'myAccountWishlist',
      routePath: '/pvt/account/wishlist',
    })

    expect(output).toContain(
      "myAccountCmsServerSideProps('myAccountWishlist', '/pvt/account/wishlist')"
    )
    expect(output).toContain('RenderSectionsBase')
    expect(output).toContain('ACCOUNT_COMPONENTS')
    expect(output).not.toContain('DynamicPage')
    expect(output).not.toContain('BeforeSection')
    expect(output).not.toContain('AfterSection')
  })

  it('emits Mode B output with DynamicPage', () => {
    const output = myAccountCmsPageTemplate({
      contentType: 'myAccountWishlist',
      routePath: '/pvt/account/wishlist',
      pagePath: 'src/customizations/src/pages/pvt/account/wishlist',
    })

    expect(output).toContain(
      "import DynamicPage from 'src/customizations/src/pages/pvt/account/wishlist'"
    )
    expect(output).toContain('<DynamicPage />')
    expect(output).toContain('RenderSectionsBase')
  })

  it('wires before/after extensions when provided', () => {
    const output = myAccountCmsPageTemplate({
      contentType: 'myAccountWishlist',
      routePath: '/pvt/account/wishlist',
      pagePath: 'src/customizations/src/pages/pvt/account/wishlist',
      beforePath: 'src/customizations/src/myAccount/extensions/wishlist/before',
      afterPath: 'src/customizations/src/myAccount/extensions/wishlist/after',
    })

    expect(output).toContain(
      "import { default as BeforeSection } from 'src/customizations/src/myAccount/extensions/wishlist/before'"
    )
    expect(output).toContain(
      "import { default as AfterSection } from 'src/customizations/src/myAccount/extensions/wishlist/after'"
    )
    expect(output).toContain('<BeforeSection />')
    expect(output).toContain('<AfterSection />')

    const beforeIdx = output.indexOf('<BeforeSection />')
    const sectionsIdx = output.indexOf('<RenderSectionsBase')
    const dynamicIdx = output.indexOf('<DynamicPage />')
    const afterIdx = output.indexOf('<AfterSection />')

    expect(beforeIdx).toBeLessThan(sectionsIdx)
    expect(sectionsIdx).toBeLessThan(dynamicIdx)
    expect(dynamicIdx).toBeLessThan(afterIdx)
  })
})
