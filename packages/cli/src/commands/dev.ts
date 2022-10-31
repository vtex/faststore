import { Command } from '@oclif/core'
import chokidar from 'chokidar'
import { spawn } from 'child_process'

import { generate } from '../utils/generate'
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

const devAbortController = new AbortController()

async function storeDev() {
  const bunDevProcess = spawn('bun develop', {
    shell: true,
    cwd: tmpDir,
    signal: devAbortController.signal,
    stdio: 'inherit',
  })

  bunDevProcess.on('close', (code) => {
    console.log(`Development server closed with code ${code}`)
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
        .on('close', resolve)
    })
  }
}
