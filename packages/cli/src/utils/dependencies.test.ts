import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NoAvailablePackageManagerError, UnknownAgentError } from './commands'
import { logger } from './logger'

const resolvePackageManagerMock = vi.hoisted(() => vi.fn())
const runCommandSyncMock = vi.hoisted(() => vi.fn())

vi.mock('./commands', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./commands')>()),
  resolvePackageManager: (...args: unknown[]) =>
    resolvePackageManagerMock(...args),
}))

vi.mock('./runCommandSync', () => ({
  runCommandSync: (...args: unknown[]) => runCommandSyncMock(...args),
}))

import { installDependencies } from './dependencies'

async function install() {
  await installDependencies({
    dependencies: ['preact@10.23.1'],
    cwd: '/store',
    errorMessage: 'failed to install Preact dependencies',
  })
}

describe('installDependencies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses "add" for agents other than npm', async () => {
    resolvePackageManagerMock.mockResolvedValue({
      agent: 'yarn',
      command: 'yarn',
    })

    await install()

    expect(resolvePackageManagerMock).toHaveBeenCalledWith('/store', {
      substitute: false,
    })
    expect(runCommandSyncMock).toHaveBeenCalledWith(
      expect.objectContaining({ cmd: 'yarn add preact@10.23.1' })
    )
  })

  it('uses "install" for npm', async () => {
    resolvePackageManagerMock.mockResolvedValue({
      agent: 'npm',
      command: 'npm',
    })

    await install()

    expect(runCommandSyncMock).toHaveBeenCalledWith(
      expect.objectContaining({ cmd: 'npm install preact@10.23.1' })
    )
  })

  it('still recognises npm behind a Volta prefix', async () => {
    resolvePackageManagerMock.mockResolvedValue({
      agent: 'npm',
      command: 'volta run npm',
    })

    await install()

    expect(runCommandSyncMock).toHaveBeenCalledWith(
      expect.objectContaining({ cmd: 'volta run npm install preact@10.23.1' })
    )
  })

  it('exits when the detected agent is not installed', async () => {
    resolvePackageManagerMock.mockRejectedValue(
      new NoAvailablePackageManagerError('pnpm is not installed')
    )
    vi.spyOn(logger, 'error').mockImplementation(() => {})
    const exitMock = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit')
    }) as typeof process.exit)

    await expect(install()).rejects.toThrow('process.exit')
    expect(exitMock).toHaveBeenCalledWith(1)
    expect(runCommandSyncMock).not.toHaveBeenCalled()

    exitMock.mockRestore()
  })

  it('exits when the detected agent is unknown', async () => {
    resolvePackageManagerMock.mockRejectedValue(
      new UnknownAgentError('not-a-package-manager')
    )
    vi.spyOn(logger, 'error').mockImplementation(() => {})
    const exitMock = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit')
    }) as typeof process.exit)

    await expect(install()).rejects.toThrow('process.exit')
    expect(exitMock).toHaveBeenCalledWith(1)

    exitMock.mockRestore()
  })

  it('rethrows unexpected resolve errors', async () => {
    resolvePackageManagerMock.mockRejectedValue(new Error('disk full'))

    await expect(install()).rejects.toThrow('disk full')
    expect(runCommandSyncMock).not.toHaveBeenCalled()
  })
})
