import type { GraphqlContext } from '..'
import type {
  MutationSubscribeToNewsletterArgs,
  PersonNewsletter,
} from '../../../__generated__/schema'

export const subscribeToNewsletter = async (
  _: any,
  { data }: MutationSubscribeToNewsletterArgs,
  { clients: { commerce } }: GraphqlContext
): Promise<PersonNewsletter | null> => {
  const response = await commerce.subscribeToNewsletter(data)
  return { id: response?.Id }
}
