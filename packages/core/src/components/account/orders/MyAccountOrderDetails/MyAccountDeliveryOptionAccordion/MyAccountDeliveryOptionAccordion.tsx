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

interface MyAccountDeliveryOptionAccordionProps {
  deliveryOption: UserOrderDeliveryOption
  contact?: UserOrderDeliveryOptionsContact | null
}

function MyAccountDeliveryOptionAccordion({
  deliveryOption,
  contact,
}: MyAccountDeliveryOptionAccordionProps) {
  const [indicesExpanded, setIndicesExpanded] = useState<Set<number>>(
    new Set([])
  )

  const title = deliveryOption.friendlyDeliveryOptionName

  const summary = `${deliveryOption.quantityOfDifferentItems} items – Total $${deliveryOption.total?.toFixed(2) || '0.00'}`

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
                price={`$${item.price?.toFixed(2) || '0.00'}`}
                tax={`$${item.tax?.toFixed(2) || '0.00'}`}
                total={`$${item.total?.toFixed(2) || '0.00'}`}
              />
            ))}
          </MyAccountDeliveryOptionAccordionProducts>
        </MyAccountAccordionPanel>
      </MyAccountAccordionItem>
    </MyAccountAccordion>
  )
}

export default MyAccountDeliveryOptionAccordion
