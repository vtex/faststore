import type { GraphqlContext } from '..'
import type { MutationUploadFileToOrderEntryArgs } from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export const uploadFileToOrderEntry = async (
  _: unknown,
  { data }: MutationUploadFileToOrderEntryArgs,
  { clients: { commerce } }: GraphqlContext
) => {
  const { fileContent, fileName, mimeType } = data

  if (!fileContent || !fileName || !mimeType) {
    throw new BadRequestError(
      'Missing required fields: fileContent, fileName, mimeType'
    )
  }

  const normalized = fileContent.replaceAll(/\s/g, '')
  const isValidBase64 =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      normalized
    )

  if (!isValidBase64) {
    throw new BadRequestError('Invalid Base64 fileContent')
  }

  const MAX_FILE_BYTES = 5 * 1024 * 1024
  const estimatedBytes = Math.floor((normalized.length * 3) / 4)

  if (estimatedBytes > MAX_FILE_BYTES) {
    throw new BadRequestError('File exceeds maximum allowed size of 5MB')
  }

  const fileBuffer = Buffer.from(normalized, 'base64')

  const result = await commerce.orderEntry.uploadFile({
    fileBuffer,
    fileName,
    mimeType,
  })

  return result
}
