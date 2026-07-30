import { getVoltaPrefix } from '@antfu/ni'
import { spawnSync } from 'node:child_process'
import { getPreferredPackageManager } from './commands'
import { logger } from './logger'

jest.mock('@antfu/ni', () => ({
  ...jest.requireActual<typeof import('@antfu/ni')>('@antfu/ni'),
  getVoltaPrefix: jest.fn(),
}))

jest.mock('node:child_process', () => ({
  spawnSync: jest.fn(),
}))

const spawnSyncMock = spawnSync as jest.Mock
const getVoltaPrefixMock = getVoltaPrefix as jest.Mock

describe('getPreferredPackageManager', () => {
  let warnMock: jest.SpyInstance

  beforeEach(() => {
    warnMock = jest.spyOn(logger, 'warn').mockImplementation(() => undefined)
    getVoltaPrefixMock.mockReturnValue('')
    spawnSyncMock.mockReturnValue({ stdout: 'yarn\n' })
  })

  afterEach(() => {
    warnMock.mockRestore()
    jest.clearAllMocks()
  })

  it('returns a known agent as-is', () => {
    spawnSyncMock.mockReturnValue({ stdout: 'pnpm\n' })

    expect(getPreferredPackageManager()).toBe('pnpm')
    expect(warnMock).not.toHaveBeenCalled()
  })

  it('keeps the Volta prefix on a known agent', () => {
    getVoltaPrefixMock.mockReturnValue('volta run')
    spawnSyncMock.mockReturnValue({ stdout: 'volta run yarn\n' })

    expect(getPreferredPackageManager()).toBe('volta run yarn')
    expect(warnMock).not.toHaveBeenCalled()
  })

  it('falls back to yarn when na leaks an interactive prompt', () => {
    // The FAS-1199 incident: an agent that is not installed makes na render
    // a confirm prompt to stdout instead of failing.
    spawnSyncMock.mockReturnValue({
      stdout:
        'Would you like to globally install pnpm (https://pnpm.io/installation)? › (y/N)\n',
    })

    expect(getPreferredPackageManager()).toBe('yarn')
    expect(warnMock).toHaveBeenCalledWith(
      expect.stringContaining('Could not resolve a known package manager')
    )
  })

  it('reports only the first line of unrecognised output', () => {
    spawnSyncMock.mockReturnValue({
      stdout: 'garbage first line\nsecond line',
    })

    getPreferredPackageManager()

    const [message] = warnMock.mock.calls[0]

    expect(message).toContain('garbage first line')
    expect(message).not.toContain('second line')
  })

  it('falls back to yarn silently on empty output', () => {
    spawnSyncMock.mockReturnValue({ stdout: '' })

    expect(getPreferredPackageManager()).toBe('yarn')
    expect(warnMock).not.toHaveBeenCalled()
  })

  it('falls back to yarn when the probe cannot be spawned', () => {
    // spawnSync reports a spawn failure via `error`, with null streams.
    spawnSyncMock.mockReturnValue({ stdout: null, error: new Error('ENOENT') })

    expect(getPreferredPackageManager()).toBe('yarn')
    expect(warnMock).not.toHaveBeenCalled()
  })

  it('keeps the Volta prefix on the fallback', () => {
    getVoltaPrefixMock.mockReturnValue('volta run')
    spawnSyncMock.mockReturnValue({ stdout: 'volta run not-an-agent\n' })

    expect(getPreferredPackageManager()).toBe('volta run yarn')
  })
})
