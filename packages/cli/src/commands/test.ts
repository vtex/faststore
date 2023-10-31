import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import chokidar from 'chokidar'
import { existsSync } from 'fs-extra'

import { getRoot, tmpDir } from '../utils/directory'

/**
 * Taken from toolbelt
 *
 * https://github.com/vtex/toolbelt/pull/442
 */
const stabilityThreshold = process.platform === 'darwin' ? 100 : 200

const defaultPatterns = ['*/**', '**']

const defaultIgnored = [
  '.DS_Store',
  'README.md',
  '.gitignore',
  'package.json',
  'node_modules/**',
  '**/node_modules/**',
  '.git/**',
  '.faststore/**',
  '**/.faststore/**',
]

const testAbortController = new AbortController()

async function storeTest() {
  const detachedDevProcess = spawn('yarn dev', {
    shell: true,
    cwd: tmpDir,
    stdio: 'ignore',
    detached: true,
  })

  const testProcess = spawn('yarn test:e2e', {
    shell: true,
    cwd: tmpDir,
    signal: testAbortController.signal,
    stdio: 'inherit',
  })

  testProcess.on('close', () => {
    detachedDevProcess.kill()
    testAbortController.abort()
  })

  testProcess.on('exit', () => {
    detachedDevProcess.kill()
    testAbortController.abort()
  })
}

export default class Test extends Command {
  async run() {
    const watcher = chokidar.watch([...defaultPatterns], {
      atomic: stabilityThreshold,
      awaitWriteFinish: {
        stabilityThreshold,
      },
      cwd: getRoot(),
      ignoreInitial: true,
      ignored: defaultIgnored,
      persistent: true,
      usePolling: process.platform === 'win32',
    })

    testAbortController.signal.addEventListener('abort', () => {
      watcher.close()
    })

    storeTest()

    return await new Promise((resolve, reject) => {
      watcher
        .on('error', () => {
          testAbortController.abort()
          reject()
        })
        .on('ready', resolve)
    })
  }
}
