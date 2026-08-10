import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { withNodeModulesBins } from './binPaths'

// mimics a hoisted monorepo: bins live at the workspace root, the store has its
// own node_modules, and `.faststore` has none
let workspaceRoot: string
let storeDir: string
let tmpDir: string

beforeAll(() => {
  workspaceRoot = fs.realpathSync(
    fs.mkdtempSync(path.join(os.tmpdir(), 'bin-paths-'))
  )
  storeDir = path.join(workspaceRoot, 'stores', 'my-store')
  tmpDir = path.join(storeDir, '.faststore')

  fs.mkdirSync(path.join(workspaceRoot, 'node_modules', '.bin'), {
    recursive: true,
  })
  fs.mkdirSync(path.join(storeDir, 'node_modules', '.bin'), { recursive: true })
  fs.mkdirSync(tmpDir, { recursive: true })
})

afterAll(() => {
  fs.rmSync(workspaceRoot, { recursive: true, force: true })
})

describe('withNodeModulesBins', () => {
  it('prepends the bin directories of every ancestor, nearest first', () => {
    const { PATH } = withNodeModulesBins(tmpDir, { PATH: '/usr/bin' })
    const entries = PATH?.split(path.delimiter) ?? []

    expect(entries.slice(0, 2)).toEqual([
      path.join(storeDir, 'node_modules', '.bin'),
      path.join(workspaceRoot, 'node_modules', '.bin'),
    ])
    expect(entries.at(-1)).toBe('/usr/bin')
  })

  it('skips ancestors without a node_modules/.bin', () => {
    const { PATH } = withNodeModulesBins(tmpDir, { PATH: '/usr/bin' })

    expect(PATH).not.toContain(
      path.join(workspaceRoot, 'stores', 'node_modules', '.bin')
    )
  })

  it('keeps the other environment variables untouched', () => {
    const env = withNodeModulesBins(tmpDir, {
      PATH: '/usr/bin',
      VTEX_ACCOUNT: 'storeframework',
    })

    expect(env.VTEX_ACCOUNT).toBe('storeframework')
  })

  it('reuses the existing PATH key casing, as used on Windows', () => {
    const env = withNodeModulesBins(tmpDir, { Path: 'C:\\Windows\\system32' })

    expect(env.PATH).toBeUndefined()
    expect(env.Path).toContain(path.join(storeDir, 'node_modules', '.bin'))
    expect(env.Path).toContain('C:\\Windows\\system32')
  })

  it('does not duplicate a bin directory already present in PATH', () => {
    const storeBinDir = path.join(storeDir, 'node_modules', '.bin')
    const { PATH } = withNodeModulesBins(tmpDir, {
      PATH: [storeBinDir, '/usr/bin'].join(path.delimiter),
    })
    const entries = PATH?.split(path.delimiter) ?? []

    expect(entries.filter((entry) => entry === storeBinDir)).toHaveLength(1)
    expect(entries[0]).toBe(path.join(workspaceRoot, 'node_modules', '.bin'))
  })

  it('does not drop the bin directories when PATH is empty', () => {
    const { PATH } = withNodeModulesBins(tmpDir, {})

    expect(PATH?.split(path.delimiter).slice(0, 2)).toEqual([
      path.join(storeDir, 'node_modules', '.bin'),
      path.join(workspaceRoot, 'node_modules', '.bin'),
    ])
  })
})
