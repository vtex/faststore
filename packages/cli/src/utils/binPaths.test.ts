import { spawnSync } from 'node:child_process'
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

  it('moves a bin directory already in PATH to its nearest-first position instead of duplicating it', () => {
    const storeBinDir = path.join(storeDir, 'node_modules', '.bin')
    const { PATH } = withNodeModulesBins(tmpDir, {
      PATH: [storeBinDir, '/usr/bin'].join(path.delimiter),
    })
    const entries = PATH?.split(path.delimiter) ?? []

    expect(entries).toEqual([
      storeBinDir,
      path.join(workspaceRoot, 'node_modules', '.bin'),
      '/usr/bin',
    ])
  })

  it('does not drop the bin directories when PATH is empty', () => {
    const { PATH } = withNodeModulesBins(tmpDir, {})

    expect(PATH?.split(path.delimiter).slice(0, 2)).toEqual([
      path.join(storeDir, 'node_modules', '.bin'),
      path.join(workspaceRoot, 'node_modules', '.bin'),
    ])
  })

  it('returns the environment untouched when no ancestor has a node_modules/.bin', () => {
    // Sibling of the fixture rather than a descendant: the walk from here goes
    // straight up the OS temp dir, where no node_modules/.bin exists.
    const binlessDir = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'bin-paths-binless-'))
    )
    const env = { PATH: '/usr/bin', VTEX_ACCOUNT: 'storeframework' }

    try {
      expect(withNodeModulesBins(binlessDir, env)).toEqual(env)
    } finally {
      fs.rmSync(binlessDir, { recursive: true, force: true })
    }
  })

  // The tests above only inspect the object we build. This one spawns a real
  // child process from `.faststore`, the way `dev` and `build` do, to check
  // that the environment is what makes a bare binary name resolve. Windows
  // would need a `.cmd` shim for the fixture, so it stays on POSIX.
  it.skipIf(process.platform === 'win32')(
    'lets a child process resolve a binary living in an ancestor bin directory',
    () => {
      const probe = path.join(
        storeDir,
        'node_modules',
        '.bin',
        'faststore-bin-probe'
      )
      fs.writeFileSync(probe, '#!/bin/sh\necho resolved\n')
      fs.chmodSync(probe, 0o755)

      const run = (env: NodeJS.ProcessEnv) =>
        spawnSync('faststore-bin-probe', {
          shell: true,
          cwd: tmpDir,
          encoding: 'utf-8',
          env,
        })

      // A PATH that cannot resolve the probe on its own, so that a passing
      // assertion below can only come from the directories we added.
      const barePath = { PATH: path.join(workspaceRoot, 'nowhere') }

      expect(run(barePath).status).not.toBe(0)
      expect(run(withNodeModulesBins(tmpDir, barePath)).stdout.trim()).toBe(
        'resolved'
      )
    }
  )
})
