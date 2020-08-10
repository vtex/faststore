/**
 * Stable outputfile implementation.
 * If the file's content haven't changed, don't write anything to the disk.
 *
 * This is necessary to avoid webpack to enter in an infinite loop
 */
import { createHash } from 'crypto'
import { outputFile as fsExtraOutputFile } from 'fs-extra'

const filesMap = new Map<string, string>()

function hash(s: string) {
  return createHash('md5').update(s, 'utf8').digest().toString('hex')
}

export const outputFile = (file: string, data: any) => {
  const newHash = hash(JSON.stringify(data))
  const oldHash = filesMap.get(file)

  // The files content are equal, don't do anything
  if (oldHash === newHash) {
    return
  }

  filesMap.set(file, newHash)

  return fsExtraOutputFile(file, data)
}
