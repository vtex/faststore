import { basename } from 'path'

export const remoteId = (path: string) => `fixture:${basename(path, '.json')}`
