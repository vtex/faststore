import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const spawnMock = vi.hoisted(() => vi.fn())
const spawnSyncMock = vi.hoisted(() => vi.fn())
const resolvePackageManagerMock = vi.hoisted(() => vi.fn())

vi.mock('node:child_process', () => ({
  spawn: (...args: unknown[]) => spawnMock(...args),
  spawnSync: (...args: unknown[]) => spawnSyncMock(...args),
}))

vi.mock('../utils/commands', () => ({
  resolvePackageManager: (...args: unknown[]) =>
    resolvePackageManagerMock(...args),
}))

import Start from './start'

/** `Command.parse` is protected, so it has to be reached through a structural type. */
type Parseable = { parse: () => Promise<{ args: { path: string } }> }

describe('Start', () => {
  let storeDir: string

  async function runStart() {
    const cmd = new Start([], {} as never)

    vi.spyOn(cmd as unknown as Parseable, 'parse').mockResolvedValue({
      args: { path: storeDir },
    })

    await cmd.run()
  }

  beforeEach(() => {
    storeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-start-'))
    fs.mkdirSync(path.join(storeDir, '.next'))
    vi.clearAllMocks()
    spawnSyncMock.mockReturnValue({ status: 0 })
  })

  afterEach(() => {
    fs.rmSync(storeDir, { recursive: true, force: true })
  })

  it('spawns the package manager binary without a shell', async () => {
    resolvePackageManagerMock.mockResolvedValue({
      agent: 'yarn',
      command: 'yarn',
      argv: ['yarn'],
    })

    await runStart()

    expect(resolvePackageManagerMock).toHaveBeenCalledWith(storeDir)
    expect(spawnMock).toHaveBeenCalledWith(
      'yarn',
      ['next', 'start', path.join(storeDir, '.faststore'), '-p', '3000'],
      { stdio: 'inherit' }
    )
    expect(spawnSyncMock).not.toHaveBeenCalled()
  })

  it('splits a Volta prefix into the spawn arguments', async () => {
    resolvePackageManagerMock.mockResolvedValue({
      agent: 'yarn',
      command: 'volta run yarn',
      argv: ['volta', 'run', 'yarn'],
    })

    await runStart()

    expect(spawnMock).toHaveBeenCalledWith(
      'volta',
      [
        'run',
        'yarn',
        'next',
        'start',
        path.join(storeDir, '.faststore'),
        '-p',
        '3000',
      ],
      { stdio: 'inherit' }
    )
  })

  it('builds first when .next is missing, through a shell', async () => {
    fs.rmSync(path.join(storeDir, '.next'), { recursive: true })
    resolvePackageManagerMock.mockResolvedValue({
      agent: 'yarn',
      command: 'volta run yarn',
      argv: ['volta', 'run', 'yarn'],
    })

    await runStart()

    expect(spawnSyncMock).toHaveBeenCalledWith(
      'volta run yarn faststore build',
      { shell: true, stdio: 'inherit' }
    )
    expect(spawnMock).toHaveBeenCalled()
  })

  it('does not serve when the build fails', async () => {
    fs.rmSync(path.join(storeDir, '.next'), { recursive: true })
    resolvePackageManagerMock.mockResolvedValue({
      agent: 'yarn',
      command: 'yarn',
      argv: ['yarn'],
    })
    spawnSyncMock.mockReturnValue({ status: 1 })

    await expect(runStart()).rejects.toThrow('faststore build" failed')
    expect(spawnMock).not.toHaveBeenCalled()
  })
})
