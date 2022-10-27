import { Command } from '@oclif/core'
import chokidar from 'chokidar'

import { generate } from '../utils/generate'
import { pathToChange } from '../utils/pathToChange'
import { getRoot } from '../utils/root'

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

export default class Dev extends Command {
  async run() {
    const queueChange = (/* path: string, remove: boolean */) => {
      // pathToChange(path, remove)

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

    await new Promise((resolve, reject) => {
      watcher
        .on('add', (file) => queueChange(file, false))
        .on('change', (file) => queueChange(file, false))
        .on('unlink', (file) => queueChange(file, false))
        .on('error', reject)
        .on('ready', resolve)
    })
  }
}
