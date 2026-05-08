import type { Context } from '..'
import type { MutationUploadFileToOrderEntryArgs } from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export const uploadFileToOrderEntry = async (
  _: unknown,
  { data }: MutationUploadFileToOrderEntryArgs,
  { clients: { commerce } }: Context
) => {
  const { fileContent, fileName, mimeType } = data

  if (!fileContent || !fileName || !mimeType) {
    throw new BadRequestError(
      'Missing required fields: fileContent, fileName, mimeType'
    )
  }

  const fileBuffer = Buffer.from(fileContent, 'base64')

  const result = await commerce.orderEntry.uploadFile({
    fileBuffer,
    fileName,
    mimeType,
  })

  return result
}
