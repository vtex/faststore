import { Args, Command } from '@oclif/core'
import { spawn } from 'child_process'
import chokidar from 'chokidar'

import { getPreferredPackageManager } from '../utils/commands'
import { getBasePath, withBasePath } from '../utils/directory'
import { generate } from '../utils/generate'

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

async function storeTest(tmpDir: string) {
  const packageManager = getPreferredPackageManager()

  const testProcess = spawn(`${packageManager} run test:e2e`, {
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
  static args = {
    path: Args.string({
      name: 'path',
      description:
        'The path where the FastStore being tested is. Defaults to cwd.',
    }),
  }

  async run() {
    const { args } = await this.parse(Test)
    const basePath = getBasePath(args.path)
    const { getRoot, tmpDir } = withBasePath(basePath)

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

    await generate({ setup: true, basePath })

    storeTest(tmpDir)

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
