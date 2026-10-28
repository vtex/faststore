import type { Context } from '..'
import type {
  MutationSubscribeToNewsletterArgs,
  PersonNewsletter,
} from '../../../__generated__/schema'
import { BadRequestError } from '../../errors'

const EMAIL_MAX_LENGTH = 254
const NAME_MAX_LENGTH = 100
// Character classes exclude `.`, so each domain label is matched once and the
// pattern stays linear on long inputs.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

export const subscribeToNewsletter = async (
  _: any,
  { data }: MutationSubscribeToNewsletterArgs,
  { clients: { commerce } }: Context
): Promise<PersonNewsletter | null> => {
  // The subscription is written with a store credential, so only validated
  // values reach Master Data.
  const email = data.email?.trim().toLowerCase() ?? ''
  const name = data.name?.trim() ?? ''

  if (email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    throw new BadRequestError('Invalid email')
  }

  if (name.length > NAME_MAX_LENGTH) {
    throw new BadRequestError(
      `Invalid name: must have at most ${NAME_MAX_LENGTH} characters`
    )
  }

  const response = await commerce.subscribeToNewsletter({
    email,
    name: name || undefined,
  })

  return { id: response?.Id }
}
