// import crypto from 'crypto'
import CJSMD5 from 'crypto-js/md5'
import CryptoJS from 'crypto-js'

// export const md5 = (payload: string) =>
//   crypto.createHash('md5').update(payload).digest('hex')
export const md5 = (payload: string) =>
  CJSMD5(payload).toString(CryptoJS.enc.Hex)
