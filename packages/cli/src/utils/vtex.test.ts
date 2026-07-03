import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const execSyncMock = vi.hoisted(() => vi.fn())

vi.mock('node:child_process', () => ({
  execSync: (...args: unknown[]) => execSyncMock(...args),
}))

import {
  assertVtexReadyForAccount,
  getLoggedVtexAccount,
  isVtexCliInstalled,
  parseAccountFromWhoami,
} from './vtex'
import { logger } from './logger'

describe('parseAccountFromWhoami', () => {
  it('parses the "email @ account / workspace" format', () => {
    expect(
      parseAccountFromWhoami('leandro.rodrigues@vtex.com @ brandless / master')
    ).toBe('brandless')
  })

  it('parses the "Logged into <account>" format', () => {
    expect(
      parseAccountFromWhoami(
        'Logged into brandless as user@vtex.com at workspace master'
      )
    ).toBe('brandless')
  })

  it('returns null for logged-out output', () => {
    expect(parseAccountFromWhoami("You're not logged in")).toBeNull()
  })
})

describe('isVtexCliInstalled', () => {
  beforeEach(() => {
    execSyncMock.mockReset()
  })

  it('returns true when vtex --version succeeds', () => {
    execSyncMock.mockReturnValue(Buffer.from('4.3.2'))
    expect(isVtexCliInstalled()).toBe(true)
  })

  it('returns false when the command throws (not installed)', () => {
    execSyncMock.mockImplementation(() => {
      throw new Error('command not found: vtex')
    })
    expect(isVtexCliInstalled()).toBe(false)
  })
})

describe('getLoggedVtexAccount', () => {
  beforeEach(() => {
    execSyncMock.mockReset()
  })

  it('returns the account from whoami', () => {
    execSyncMock.mockReturnValue(
      Buffer.from('leandro.rodrigues@vtex.com @ brandless / master')
    )
    expect(getLoggedVtexAccount()).toBe('brandless')
  })

  it('returns null when whoami fails', () => {
    execSyncMock.mockImplementation(() => {
      throw new Error('not logged in')
    })
    expect(getLoggedVtexAccount()).toBeNull()
  })
})

describe('assertVtexReadyForAccount', () => {
  let exitMock: ReturnType<typeof vi.spyOn>
  let errorMock: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    execSyncMock.mockReset()
    exitMock = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
    errorMock = vi.spyOn(logger, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    exitMock.mockRestore()
    errorMock.mockRestore()
  })

  function mockVtex({
    installed,
    whoami,
  }: {
    installed: boolean
    whoami?: string
  }) {
    execSyncMock.mockImplementation((cmd: string) => {
      if (cmd.startsWith('vtex --version')) {
        if (!installed) {
          throw new Error('command not found: vtex')
        }
        return Buffer.from('4.3.2')
      }

      if (cmd.startsWith('vtex whoami')) {
        if (whoami === undefined) {
          throw new Error('not logged in')
        }
        return Buffer.from(whoami)
      }

      return Buffer.from('')
    })
  }

  it('passes when installed and logged into the store account', () => {
    mockVtex({
      installed: true,
      whoami: 'user@vtex.com @ brandless / master',
    })

    assertVtexReadyForAccount('brandless')

    expect(exitMock).not.toHaveBeenCalled()
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('exits when the toolbelt is not installed', () => {
    mockVtex({ installed: false })

    assertVtexReadyForAccount('brandless')

    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('VTEX toolbelt')
    )
    expect(exitMock).toHaveBeenCalledWith(1)
  })

  it('exits and suggests login when logged out', () => {
    mockVtex({ installed: true, whoami: undefined })

    assertVtexReadyForAccount('brandless')

    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('vtex login brandless')
    )
    expect(exitMock).toHaveBeenCalledWith(1)
  })

  it('exits on account mismatch', () => {
    mockVtex({
      installed: true,
      whoami: 'user@vtex.com @ otheraccount / master',
    })

    assertVtexReadyForAccount('brandless')

    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining('vtex switch brandless')
    )
    expect(exitMock).toHaveBeenCalledWith(1)
  })

  it('accepts any logged-in account when the store account is unknown', () => {
    mockVtex({
      installed: true,
      whoami: 'user@vtex.com @ whatever / master',
    })

    assertVtexReadyForAccount(undefined)

    expect(exitMock).not.toHaveBeenCalled()
  })
})
