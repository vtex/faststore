import { Command } from '@oclif/core'
import { readFileSync } from 'fs'
import { Readable } from 'stream'
import { resolve as resolvePath, sep } from 'path'
import chokidar from 'chokidar'

export interface ChangeToSend {
  path: string | null
  content: string | Readable | Buffer | NodeJS.ReadableStream
  byteSize: number
}

const getRoot = () => {
  if (process.env.OCLIF_COMPILATION) {
    return ''
  }

  return process.cwd()
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

    console.log(getRoot())
    const changeQueue: ChangeToSend[] = []

    const pathToChange = (path: string, remove?: boolean): ChangeToSend => {
      const content = remove
        ? ''
        : readFileSync(resolvePath(root, path)).toString('base64')

      const byteSize = remove ? 0 : Buffer.byteLength(content)

      return {
        content,
        byteSize,
        path: path.split(sep).join('/'),
      }
    }

    const queueChange = (path: string, remove?: boolean) => {
      // console.log(
      //   `${chalk.gray(moment().format('HH:mm:ss:SSS'))} - ${
      //     remove ? DELETE_SIGN : UPDATE_SIGN
      //   } ${path}`
      // )


      console.log(path)

      changeQueue.push(pathToChange(path, remove))
      copyChanges()
    }

    const copyChanges = () => {
      /** copy changes to .faststore */
    }

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
        .on('add', (file) => queueChange(file))
        .on('change', (file) => queueChange(file))
        .on('unlink', (file) => queueChange(file, true))
        .on('error', reject)
        .on('ready', resolve)
    })
  }
}
