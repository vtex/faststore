import { describe, expect, it } from 'vitest'
import { isSignInAreaResolved } from '../../../src/sdk/session/isSignInAreaResolved'

describe('isSignInAreaResolved', () => {
  it('waits for the first validation of this page load', () => {
    expect(
      isSignInAreaResolved({ isSessionReady: true, hasValidated: false })
    ).toBe(false)
  })

  it('resolves once the session is ready and validated', () => {
    expect(
      isSignInAreaResolved({ isSessionReady: true, hasValidated: true })
    ).toBe(true)
  })

  it('never resolves before the session is ready', () => {
    expect(
      isSignInAreaResolved({ isSessionReady: false, hasValidated: true })
    ).toBe(false)
  })
})
