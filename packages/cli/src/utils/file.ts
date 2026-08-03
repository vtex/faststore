import fs from 'node:fs'
import path from 'node:path'

export function saveFile(fileLocation: string) {
  fs.mkdirSync(path.dirname(fileLocation), { recursive: true })

  return (content: string) => {
    fs.writeFileSync(fileLocation, content)
  }
}
