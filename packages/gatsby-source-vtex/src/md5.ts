import { createHash } from 'crypto'

export const md5 = (x: string) => createHash('md5').update(x).digest('hex')
