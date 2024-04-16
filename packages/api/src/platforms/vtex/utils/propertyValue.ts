import type { IStorePropertyValue } from '../../../__generated__/schema'
import type { Attachment } from '../clients/commerce/types/OrderForm'
import type { Attribute } from '../clients/search/types/ProductSearchResult'
import { md5 } from './md5'

export const VALUE_REFERENCES = {
  attachment: 'ATTACHMENT',
  specification: 'SPECIFICATION',
  attribute: 'ATTRIBUTE',
} as const

export function attachmentToPropertyValue(attachment: Attachment) {
  return {
    name: attachment.name,
    value: attachment.content,
    valueReference: VALUE_REFERENCES.attachment,
  }
}

export function attributeToPropertyValue(attribute: Attribute) {
  return {
    propertyID: attribute.id,
    name: attribute.name,
    value: attribute.value,
    valueReference: {
      valueReference: VALUE_REFERENCES.attribute,
      visible: attribute.visible,
    },
  }
}

export function getPropertyId(item: IStorePropertyValue) {
  return md5(
    `${item.name}:${JSON.stringify(item.value)}:${item.valueReference}`
  )
}
