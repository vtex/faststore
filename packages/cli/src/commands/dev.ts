import { Command } from '@oclif/core'
import { Readable } from 'stream'
import chokidar from 'chokidar'
import getRoot from '../utils/getRoot'
import { generate } from '../utils/generate'

import { getRoot } from '../utils/root'

export interface ChangeToCopy {
  path: string | null
  content: string | Readable | Buffer | NodeJS.ReadableStream
}

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
    const root = getRoot()

    const pathToChange = (path: string, remove?: boolean): ChangeToCopy => {
      const content = remove
        ? ''
        : readFileSync(resolvePath(root, path)).toString('base64')

      return {
        content,
        path: path.split(sep).join('/'),
      }
    }

    const queueChange = (path: string, remove?: boolean) => {
      pathToChange(path, remove)

      copyChanges()
    }

    const copyChanges = () => {
      /** copy changes to .faststore */
    }

    const watcher = chokidar.watch([...defaultPatterns], {
      atomic: stabilityThreshold,
      awaitWriteFinish: {
        stabilityThreshold,
      },
      cwd: root,
      ignoreInitial: true,
      ignored: defaultIgnored,
      persistent: true,
      usePolling: process.platform === 'win32',
    })

    await new Promise((resolve, reject) => {
      watcher
        .on('add', () => generate())
        .on('change', () => generate())
        .on('unlink', () => generate())
        .on('error', reject)
        .on('ready', resolve)
    })
  }
}
