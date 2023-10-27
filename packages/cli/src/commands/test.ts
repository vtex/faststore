import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import chokidar from 'chokidar'
import { existsSync } from 'fs-extra'

import { getRoot, tmpDir } from '../utils/directory'
import { generate} from '../utils/generate'

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
    if (!existsSync(tmpDir)) {
      throw Error(
        'The ".faststore" directory could not be found. If you are trying to test your store, run "yarn dev" in another window first.'
      )
    }

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
