import { resolve as resolvePath, sep } from 'path'
import { Readable } from 'stream'
import { readFileSync } from 'fs-extra'
import { getRoot } from './directory'

export interface ContentFromPath {
  path: string | null
  content: string | Readable | Buffer | NodeJS.ReadableStream
}

const getContentFromPath = (path: string, remove?: boolean): ContentFromPath => {
  const content = remove
    ? ''
    : readFileSync(resolvePath(getRoot(), path)).toString('base64')

  return {
    content,
    path: path.split(sep).join('/'),
  }
}

export { getContentFromPath }