import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import chokidar from 'chokidar'

import { copyCypressFiles } from '../utils/generate'
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
  await copyCypressFiles()

  const testProcess = spawn('yarn test:e2e', {
    shell: true,
    cwd: tmpDir,
    signal: testAbortController.signal,
    stdio: 'inherit',
  })

  testProcess.on('close', () => {
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
