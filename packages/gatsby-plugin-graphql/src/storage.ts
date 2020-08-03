import { createHash } from 'crypto'

import { outputJSONSync, readJSONSync } from 'fs-extra'

const sha256 = (data: string) => createHash('sha256').update(data).digest('hex')

export class Storage {
  constructor(public filePath: string) {}

  public clear = () => outputJSONSync(this.filePath, {})

  public add = (query: string) => {
    this.set(sha256(query), query)
  }

  public set = (hash: string, query: string) => {
    const data = readJSONSync(this.filePath)

    data[hash] = query

    outputJSONSync(this.filePath, data)
  }
}
