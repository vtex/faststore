import { readdir as readdirCB } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const readdir = promisify(readdirCB)

export async function listFilesRecursively(path: string) {
  const promisesToWaitOn = []
  const dirents = await readdir(path, {
    encoding: 'utf-8',
    withFileTypes: true,
  })

  const result = []

  for (const dirent of dirents) {
    if (dirent.isFile()) {
      result.push(dirent.name)
    } else if (dirent.isDirectory()) {
      promisesToWaitOn.push(
        listFilesRecursively(join(path, dirent.name)).then((files) =>
          result.push(...files.map((file) => join(dirent.name, file)))
        )
      )
    }
  }

  await Promise.all(promisesToWaitOn)

  return result
}
