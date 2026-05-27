import type {
  UserOrderDeliveryOption,
  UserOrderDeliveryOptionsContact,
} from '@generated/graphql'
import { useState } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from '../../../components/Accordion'
import { useFormatPrice } from '../../../utils/useFormatPrice'
import DeliveryOptionAccordionDeliveryInfo from './DeliveryOptionAccordionDeliveryInfo'
import {
  DeliveryOptionAccordionProduct,
  DeliveryOptionAccordionProducts,
} from './DeliveryOptionAccordionProducts'

import {
  type OrderDeliverySectionLabels,
  resolveOrderDeliveryLabels,
} from '../orderDetailsLabels'

interface DeliveryOptionAccordionProps {
  deliveryOption: UserOrderDeliveryOption
  contact?: UserOrderDeliveryOptionsContact | null
  currencyCode: string
  labels?: OrderDeliverySectionLabels
  customFields?: Array<{
    type: string
    id: string
    fields?: Array<{
      name: string
      value: string
      refId?: string
    }>
  }>
}

function DeliveryOptionAccordion({
  deliveryOption,
  contact,
  currencyCode,
  labels: labelsProp,
  customFields,
}: DeliveryOptionAccordionProps) {
  const labels = resolveOrderDeliveryLabels(labelsProp)
  const [indicesExpanded, setIndicesExpanded] = useState<Set<number>>(
    new Set([])
  )
  const formatPrice = useFormatPrice()

  const title = deliveryOption.friendlyDeliveryOptionName

  const itemCount = labels.itemCountTemplate.replace(
    '{count}',
    String(deliveryOption.quantityOfDifferentItems)
  )

  const summary = `${itemCount} – ${labels.totalLabel} ${formatPrice(deliveryOption.total ?? 0, currencyCode)}`

  const onChange = (index: number) => {
    if (indicesExpanded.has(index)) {
      indicesExpanded.delete(index)
      setIndicesExpanded(new Set(indicesExpanded))
    } else {
      setIndicesExpanded(new Set(indicesExpanded.add(index)))
    }
  }

  return (
    <Accordion
      indices={indicesExpanded}
      onChange={onChange}
      data-fs-delivery-option-accordion
    >
      <AccordionItem index={0} key={String(0)}>
        <AccordionButton title={title} summary={summary} />
        <AccordionPanel>
          <DeliveryOptionAccordionDeliveryInfo
            deliveryOption={deliveryOption}
            contact={contact}
          />
          <DeliveryOptionAccordionProducts>
            {deliveryOption.items?.map((item, index) => {
              const tax = (item.tax ?? 0) + (item.taxPriceTagsTotal ?? 0)
              return (
                <DeliveryOptionAccordionProduct
                  key={index}
                  image={item.imageUrl || ''}
                  quantity={item.quantity}
                  name={item.name}
                  field={
                    customFields?.find((cf) => cf.id === item.uniqueId)
                      ?.fields?.[0]
                  }
                  price={formatPrice(item.sellingPrice ?? 0, currencyCode)}
                  tax={formatPrice(tax, currencyCode)}
                  total={formatPrice(item.total ?? 0, currencyCode)}
                />
              )
            })}
          </DeliveryOptionAccordionProducts>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default DeliveryOptionAccordion
