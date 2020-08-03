import { outputJSONSync, readJSONSync } from 'fs-extra'

export class Storage<T = string> {
  constructor(public filePath: string) {}

  public clear = () => outputJSONSync(this.filePath, {})

  public set = (key: string, value: T) => {
    const data = readJSONSync(this.filePath)

    data[key] = value

    outputJSONSync(this.filePath, data)
  }

  public getAll = (): T => readJSONSync(this.filePath)
}
