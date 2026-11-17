import { describe, expect, it } from 'vitest'

import { myAccountPageTemplate } from './myAccountPage'

describe('myAccountPageTemplate', () => {
  it('passes the B2B buyer flag to Layout using the core prop name', () => {
    const output = myAccountPageTemplate(
      'src/customizations/src/pages/pvt/account/wishlist'
    )

    expect(output).toContain('isB2BBuyer')
    expect(output).toContain(
      '<Layout accountName={accountName} isB2BBuyer={isB2BBuyer}>'
    )
    expect(output).not.toContain('isRepresentative')
  })
})
