import { JsonLd, type JsonLdProps } from './JsonLd'

export function setItemListElements(items: ItemListElement[]) {
  if (items && items.length) {
    return items.map(({ type, ...rest }) => ({
      '@type': type ?? 'ListItem',
      ...rest,
    }))
  }

  return undefined
}

export interface ItemListElement {
  type?: string
  [key: string]: any
}

export interface ItemListJsonLdProps extends JsonLdProps {
  itemListElements: ItemListElement[]
}

function ItemListJsonLd({
  type = 'ItemList',
  keyOverride,
  itemListElements,
  ...rest
}: ItemListJsonLdProps) {
  const data = {
    ...rest,
    itemListElement: setItemListElements(itemListElements),
  }

  return (
    <JsonLd
      type={type}
      keyOverride={keyOverride}
      {...data}
      scriptKey="ItemList"
    />
  )
}

export default ItemListJsonLd
