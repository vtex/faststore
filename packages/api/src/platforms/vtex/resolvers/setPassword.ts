import type { Context } from '..'
import type {
  MutationSetPasswordArgs,
  SetPasswordResponse,
} from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

export const setPassword = async (
  _: any,
  { data }: MutationSetPasswordArgs,
  { clients: { commerce } }: Context
): Promise<SetPasswordResponse> => {
  if (!data?.email) {
    throw new BadRequestError('Missing email')
  }

  const response = await commerce.vtexid.setPassword({
    email: data.email,
    newPassword: data.newPassword,
    currentPassword: data.currentPassword,
    accesskey: data?.accesskey ?? '',
    recaptcha: data?.recaptcha ?? '',
  })

  return { success: response.success, message: response?.message ?? '' }
}
