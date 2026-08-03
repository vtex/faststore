import { beforeEach, describe, expect, it, vi } from 'vitest'

const resolvePackageManagerMock = vi.hoisted(() => vi.fn())
const runCommandSyncMock = vi.hoisted(() => vi.fn())

vi.mock('./commands', () => ({
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
})
