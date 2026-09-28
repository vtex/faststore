import type { IStorePropertyValue } from '../../../__generated__/schema'
import type {
  Attachment,
  OrderFormBundleItem,
} from '../clients/commerce/types/OrderForm'
import type { Attribute } from '../clients/search/types/ProductSearchResult'
import { md5 } from './md5'

export const VALUE_REFERENCES = {
  attachment: 'ATTACHMENT',
  specification: 'SPECIFICATION',
  attribute: 'ATTRIBUTE',
  /**
   * A VTEX Service (Checkout "offering") applied to a cart line. Mirrors one
   * entry of the orderForm item's `bundleItems`; the item's `offerings` field
   * lists the services *available* for the line, not the applied ones.
   */
  service: 'SERVICE',
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

const byName = (a: Attachment, b: Attachment) => {
  if (a.name < b.name) {
    return -1
  }

  if (a.name > b.name) {
    return 1
  }

  return 0
}

const sortAttachments = (attachments?: Attachment[] | null): Attachment[] =>
  [...(attachments ?? [])].sort(byName)

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

/** A hashable attachment has a name and a content object. Anything else is ignored. */
const isAttachment = (value: unknown): value is Attachment =>
  isPlainRecord(value) &&
  typeof value.name === 'string' &&
  isPlainRecord(value.content)

/**
 * Key of a service. Depends only on the service `id` and its own attachments
 * (e.g. a gift message), never on name, price or locale, so the browser and the
 * server derive the same key for the same service.
 */
const serviceKey = (id: string, attachments?: readonly unknown[] | null) =>
  md5(
    `SERVICE:${id}:${JSON.stringify(
      sortAttachments((attachments ?? []).filter(isAttachment))
    )}`
  )

/** Never matches a real service key (md5 output is hex only). */
const UNREADABLE_SERVICE_KEY = 'SERVICE:unreadable'

export interface ServicePropertyValue {
  id: string
  price: number
  attachments: Attachment[]
}

export function serviceToPropertyValue(service: OrderFormBundleItem) {
  const attachments = service.attachments ?? []

  return {
    propertyID: serviceKey(service.id, attachments),
    name: service.name,
    value: {
      id: service.id,
      price: service.sellingPrice / 100,
      attachments,
    } as ServicePropertyValue,
    valueReference: VALUE_REFERENCES.service,
  }
}

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const readServiceValue = (
  value: unknown
): (Pick<ServicePropertyValue, 'id'> & { attachments?: unknown }) | null => {
  const parsed = typeof value === 'string' ? parseJson(value) : value

  if (parsed === null || typeof parsed !== 'object') {
    return null
  }

  const { id, attachments } = parsed as Record<string, unknown>

  if (typeof id !== 'string' && typeof id !== 'number') {
    return null
  }

  return { id: String(id), attachments }
}

/**
 * Stable key of a SERVICE property; depends only on the service id and its
 * attachments. The property `value` may arrive as an object or as a JSON
 * string (`ObjectOrString`). An unreadable value yields a key that matches no
 * orderForm service.
 */
export function getServiceKey(property: IStorePropertyValue): string {
  const service = readServiceValue(property.value)

  if (!service) {
    return UNREADABLE_SERVICE_KEY
  }

  return serviceKey(
    service.id,
    Array.isArray(service.attachments) ? service.attachments : []
  )
}
