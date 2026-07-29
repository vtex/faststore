import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { MockInstance } from 'vitest'
import { cmdExists, detect, getVoltaPrefix } from '@antfu/ni'
import {
  NoAvailablePackageManagerError,
  UnknownAgentError,
  getPreferredPackageManager,
  resolvePackageManager,
} from './commands'
import { logger } from './logger'

vi.mock('@antfu/ni', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@antfu/ni')>()),
  detect: vi.fn(),
  cmdExists: vi.fn(),
  getVoltaPrefix: vi.fn(),
}))

const onlyAvailable =
  (...available: string[]) =>
  (cmd: string) =>
    available.includes(cmd)

describe('resolvePackageManager', () => {
  let cwd: string
  let warnMock: MockInstance<typeof console.warn>

  beforeEach(() => {
    cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-commands-'))
    warnMock = vi.spyOn(logger, 'warn').mockImplementation(() => {})
    vi.mocked(getVoltaPrefix).mockReturnValue('')
    vi.mocked(cmdExists).mockImplementation(
      onlyAvailable('yarn', 'npm', 'pnpm')
    )
  })

  afterEach(() => {
    warnMock.mockRestore()
    vi.mocked(detect).mockReset()
    fs.rmSync(cwd, { recursive: true, force: true })
  })

  it('never lets ni go interactive', async () => {
    vi.mocked(detect).mockResolvedValue('yarn')

    await resolvePackageManager(cwd)

    expect(detect).toHaveBeenCalledWith(
      expect.objectContaining({ programmatic: true })
    )
  })

  it('returns the detected agent when its executable is available', async () => {
    vi.mocked(detect).mockResolvedValue('pnpm')

    await expect(resolvePackageManager(cwd)).resolves.toEqual({
      agent: 'pnpm',
      command: 'pnpm',
      argv: ['pnpm'],
    })
    expect(warnMock).not.toHaveBeenCalled()
  })

  it('keeps the Volta prefix out of the agent id', async () => {
    vi.mocked(detect).mockResolvedValue('yarn')
    vi.mocked(getVoltaPrefix).mockReturnValue('volta run')

    await expect(resolvePackageManager(cwd)).resolves.toEqual({
      agent: 'yarn',
      command: 'volta run yarn',
      argv: ['volta', 'run', 'yarn'],
    })
  })

  it('resolves versioned agents to their bare executable', async () => {
    vi.mocked(detect).mockResolvedValue('yarn@berry')

    await expect(resolvePackageManager(cwd)).resolves.toEqual({
      agent: 'yarn@berry',
      command: 'yarn',
      argv: ['yarn'],
    })
  })

  it('defaults to yarn when nothing is detected', async () => {
    vi.mocked(detect).mockResolvedValue(null)

    const { agent } = await resolvePackageManager(cwd)

    expect(agent).toBe('yarn')
  })

  it('substitutes an available agent and reports the substitution', async () => {
    vi.mocked(detect).mockResolvedValue('pnpm')
    vi.mocked(cmdExists).mockImplementation(onlyAvailable('yarn', 'npm'))

    const { agent, command } = await resolvePackageManager(cwd)

    expect(agent).toBe('yarn')
    expect(command).toBe('yarn')
    expect(warnMock).toHaveBeenCalledWith(
      expect.stringContaining('Detected "pnpm" but it is not installed')
    )
    expect(warnMock).toHaveBeenCalledWith(
      expect.stringContaining('Using "yarn" instead')
    )
  })

  it('falls back to npm when yarn is unavailable too', async () => {
    vi.mocked(detect).mockResolvedValue('pnpm')
    vi.mocked(cmdExists).mockImplementation(onlyAvailable('npm'))

    const { agent } = await resolvePackageManager(cwd)

    expect(agent).toBe('npm')
  })

  it('names the committed lockfiles when more than one is present', async () => {
    fs.writeFileSync(path.join(cwd, 'yarn.lock'), '')
    fs.writeFileSync(path.join(cwd, 'pnpm-lock.yaml'), '')
    vi.mocked(detect).mockResolvedValue('pnpm')
    vi.mocked(cmdExists).mockImplementation(onlyAvailable('yarn', 'npm'))

    await resolvePackageManager(cwd)

    const [message] = warnMock.mock.calls[0] as [string]
    expect(message).toContain('More than one lockfile is committed')
    expect(message).toContain('pnpm-lock.yaml')
    expect(message).toContain('yarn.lock')
  })

  it('does not mention lockfiles when only one is committed', async () => {
    fs.writeFileSync(path.join(cwd, 'pnpm-lock.yaml'), '')
    vi.mocked(detect).mockResolvedValue('pnpm')
    vi.mocked(cmdExists).mockImplementation(onlyAvailable('yarn', 'npm'))

    await resolvePackageManager(cwd)

    const [message] = warnMock.mock.calls[0] as [string]
    expect(message).not.toContain('More than one lockfile is committed')
  })

  it('throws when no package manager is available at all', async () => {
    vi.mocked(detect).mockResolvedValue('pnpm')
    vi.mocked(cmdExists).mockImplementation(onlyAvailable())

    await expect(resolvePackageManager(cwd)).rejects.toThrow(
      NoAvailablePackageManagerError
    )
  })

  it('throws instead of forwarding an unknown agent to a shell', async () => {
    // Deliberately not a real package manager, so this keeps asserting the
    // UnknownAgentError path even if `ni` grows support for a new agent.
    vi.mocked(detect).mockResolvedValue('not-a-package-manager' as never)

    await expect(resolvePackageManager(cwd)).rejects.toThrow(UnknownAgentError)
  })
})

describe('getPreferredPackageManager', () => {
  beforeEach(() => {
    vi.mocked(cmdExists).mockImplementation(onlyAvailable('yarn'))
    vi.mocked(getVoltaPrefix).mockReturnValue('volta run')
    vi.mocked(detect).mockResolvedValue('yarn')
  })

  it('returns the shell-ready command', async () => {
    await expect(getPreferredPackageManager()).resolves.toBe('volta run yarn')
  })
})
