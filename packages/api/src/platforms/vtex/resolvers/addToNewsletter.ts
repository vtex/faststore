import type { Context } from '..'
import type {
  MutationAddToNewsletterArgs,
  PersonNewsletter,
} from '../../../__generated__/schema'

export const addToNewsletter = async (
  _: any,
  { data }: MutationAddToNewsletterArgs,
  { clients: { commerce } }: Context
): Promise<PersonNewsletter | null> => {
  const response = await commerce.addToNewsletter(data)
  return { id: response?.Id }
}
