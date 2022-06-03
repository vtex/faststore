import type { IStorePropertyValue } from '../../../__generated__/schema'
import type { Attachment } from '../clients/commerce/types/OrderForm'
import { md5 } from './md5'

export const VALUE_REFERENCES = {
  attachment: 'ATTACHMENT',
  specification: 'SPECIFICATION',
} as const

export function attachmentToPropertyValue(attachment: Attachment) {
  return {
    name: attachment.name,
    value: attachment.content,
    valueReference: VALUE_REFERENCES.attachment,
  }
}

export function getPropertyId(item: IStorePropertyValue) {
  return md5(
    `${item.name}:${JSON.stringify(item.value)}:${item.valueReference}`
  )
}
