import crypto from 'node:crypto'

export const md5 = (payload: string) =>
  crypto.createHash('md5').update(payload).digest('hex')
