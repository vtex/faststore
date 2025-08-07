import type {
  UserOrderDeliveryOption,
  UserOrderDeliveryOptionsContact,
} from '../../../../../../@generated/graphql'
import { useState } from 'react'
import {
  MyAccountAccordion,
  MyAccountAccordionButton,
  MyAccountAccordionItem,
  MyAccountAccordionPanel,
} from '../../../components/MyAccountAccordion'
import { useFormatPrice } from '../../../utils/useFormatPrice'
import MyAccountDeliveryOptionAccordionDeliveryInfo from './MyAccountDeliveryOptionAccordionDeliveryInfo'
import {
  MyAccountDeliveryOptionAccordionProduct,
  MyAccountDeliveryOptionAccordionProducts,
} from './MyAccountDeliveryOptionAccordionProducts'

interface MyAccountDeliveryOptionAccordionProps {
  deliveryOption: UserOrderDeliveryOption
  contact?: UserOrderDeliveryOptionsContact | null
  currencyCode: string
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

function MyAccountDeliveryOptionAccordion({
  deliveryOption,
  contact,
  currencyCode,
  customFields,
}: MyAccountDeliveryOptionAccordionProps) {
  const [indicesExpanded, setIndicesExpanded] = useState<Set<number>>(
    new Set([])
  )
  const formatPrice = useFormatPrice()

  const title = deliveryOption.friendlyDeliveryOptionName

  const summary = `${deliveryOption.quantityOfDifferentItems} ${deliveryOption.quantityOfDifferentItems === 1 ? 'item' : 'items'} – Total ${formatPrice(deliveryOption.total ?? 0, currencyCode)}`

  const onChange = (index: number) => {
    if (indicesExpanded.has(index)) {
      indicesExpanded.delete(index)
      setIndicesExpanded(new Set(indicesExpanded))
    } else {
      setIndicesExpanded(new Set(indicesExpanded.add(index)))
    }
  }

  return (
    <MyAccountAccordion
      indices={indicesExpanded}
      onChange={onChange}
      data-fs-delivery-option-accordion
    >
      <MyAccountAccordionItem index={0} key={String(0)}>
        <MyAccountAccordionButton title={title} summary={summary} />
        <MyAccountAccordionPanel>
          <MyAccountDeliveryOptionAccordionDeliveryInfo
            deliveryOption={deliveryOption}
            contact={contact}
          />
          <MyAccountDeliveryOptionAccordionProducts>
            {deliveryOption.items?.map((item, index) => (
              <MyAccountDeliveryOptionAccordionProduct
                key={index}
                image={item.imageUrl || ''}
                quantity={item.quantity}
                name={item.name}
                field={
                  customFields?.find((cf) => cf.id === item.uniqueId)
                    ?.fields?.[0]
                }
                price={formatPrice(item.price ?? 0, currencyCode)}
                tax={formatPrice(item.tax ?? 0, currencyCode)}
                total={formatPrice(item.total ?? 0, currencyCode)}
              />
            ))}
          </MyAccountDeliveryOptionAccordionProducts>
        </MyAccountAccordionPanel>
      </MyAccountAccordionItem>
    </MyAccountAccordion>
  )
}

export default MyAccountDeliveryOptionAccordion
