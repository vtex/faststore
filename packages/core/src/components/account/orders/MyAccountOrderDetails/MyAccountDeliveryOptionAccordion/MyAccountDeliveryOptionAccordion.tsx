import { useState } from 'react'
import type {
  UserOrderDeliveryOption,
  UserOrderDeliveryOptionsContact,
} from '@generated/graphql'
import MyAccountDeliveryOptionAccordionDeliveryInfo from './MyAccountDeliveryOptionAccordionDeliveryInfo'
import {
  MyAccountDeliveryOptionAccordionProducts,
  MyAccountDeliveryOptionAccordionProduct,
} from './MyAccountDeliveryOptionAccordionProducts'
import {
  MyAccountAccordion,
  MyAccountAccordionItem,
  MyAccountAccordionButton,
  MyAccountAccordionPanel,
} from '../../../components/MyAccountAccordion'
import { useFormatPrice } from '../../../utils/useFormatPrice'

interface MyAccountDeliveryOptionAccordionProps {
  deliveryOption: UserOrderDeliveryOption
  contact?: UserOrderDeliveryOptionsContact | null
  currencyCode: string
}

function MyAccountDeliveryOptionAccordion({
  deliveryOption,
  contact,
  currencyCode,
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
                // TODO: custom field
                // costCenter={item.costCenter}
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
