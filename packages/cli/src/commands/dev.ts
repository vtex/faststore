import { Command } from '@oclif/core'
import { Readable } from 'stream'
import chokidar from 'chokidar'
import getRoot from '../utils/getRoot'
import { generate } from '../utils/generate'

export interface ChangeToSend {
  path: string | null
  content: string | Readable | Buffer | NodeJS.ReadableStream
  byteSize: number
}

const stabilityThreshold = process.platform === 'darwin' ? 100 : 200

const defaultPatterns = [
  '*/**',
  'store.config.js'
]

const defaultIgnored = [
  '.DS_Store',
  'README.md',
  '.gitignore',
  'package.json',
  'node_modules/**',
  '**/node_modules/**',
  '.git/**',
  'cypress/videos/**',
  'cypress/screenshots/**',
]

export default class Dev extends Command {
  async run() {
    const root = getRoot()

    const addIgnoreNodeModulesRule = (
      paths: Array<string | ((path: string) => boolean)>
    ) =>
      paths.concat([
        (path: string) => path.includes('node_modules'),
        (path: string) => path.includes('.faststore'),
        (path: string) => path.includes('.git'),
      ])

    const watcher = chokidar.watch(
      [...defaultPatterns],
      {
        atomic: stabilityThreshold,
        awaitWriteFinish: {
          stabilityThreshold,
        },
        cwd: root,
        ignoreInitial: true,
        ignored: addIgnoreNodeModulesRule(defaultIgnored),
        persistent: true,
        usePolling: process.platform === 'win32',
      }
    )

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
