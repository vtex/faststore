import { beforeEach, describe, expect, it, vi } from 'vitest'

import { runCommandSync } from './runCommandSync'

const execSyncMock = vi.hoisted(() => vi.fn())

vi.mock('node:child_process', () => ({ execSync: execSyncMock }))

const optionsOfLastCall = () => execSyncMock.mock.calls.at(-1)?.[1]

describe('runCommandSync', () => {
  beforeEach(() => {
    execSyncMock.mockClear()
  })

  it('forwards a custom environment to the child process', () => {
    const env = {
      PATH: '/store/node_modules/.bin',
      VTEX_ACCOUNT: 'storeframework',
    }

    runCommandSync({
      cmd: 'yarn predev',
      errorMessage: 'predev failed',
      throws: 'error',
      cwd: '/store/.faststore',
      env,
    })

    expect(optionsOfLastCall()).toMatchObject({
      cwd: '/store/.faststore',
      env,
    })
  })

  // execSync treats an undefined env as "inherit process.env", which is what
  // the call sites that never pass one rely on.
  it('leaves the environment to the child when the caller does not pass one', () => {
    runCommandSync({
      cmd: 'yarn generate',
      errorMessage: 'generate failed',
      throws: 'error',
    })

    expect(optionsOfLastCall()?.env).toBeUndefined()
  })
})
