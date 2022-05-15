import crypto from 'crypto'

export const md5 = (payload: string) =>
  crypto.createHash('md5').update(payload).digest('hex')
