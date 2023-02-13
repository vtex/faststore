import { Command } from '@oclif/core'
import { spawn } from 'child_process'
import chokidar from 'chokidar'

import { getRoot, tmpDir } from '../utils/directory'
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

const devAbortController = new AbortController()

async function storeDev() {
  const devProcess = spawn('yarn dev', {
    shell: true,
    cwd: tmpDir,
    signal: devAbortController.signal,
    stdio: 'inherit',
  })

  devProcess.on('close', () => {
    devAbortController.abort()
  })
}

export default class Dev extends Command {
  async run() {
    const queueChange = (/* path: string, remove: boolean */) => {
      // getContentFromPath(path, remove)

      generate()
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

    devAbortController.signal.addEventListener('abort', () => {
      watcher.close()
    })

    await generate({ setup: true })

    storeDev()

    return await new Promise((resolve, reject) => {
      watcher
        .on('add', (/*file*/) => queueChange(/*file, false*/))
        .on('change', (/*file*/) => queueChange(/*file, false*/))
        .on('unlink', (/*file*/) => queueChange(/*file, true*/))
        .on('error', () => {
          devAbortController.abort()
          reject()
        })
        .on('ready', resolve)
    })
  }
}
