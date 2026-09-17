import type { ReactNode } from 'react'
import { camelCaseToTitle } from 'src/utils/utilities'
import type { OrderDeliverySectionLabels } from '../orderDetailsLabels'

interface DeliveryOptionAccordionProductProps {
  image: string
  quantity: number
  name: string
  field?: {
    name: string
    value: string
    refId?: string
  }
  price: string
  tax: string
  total: string
  labels: Required<OrderDeliverySectionLabels>
}

function DeliveryOptionAccordionProduct({
  image,
  quantity,
  name,
  field,
  price,
  tax,
  total,
  labels,
}: DeliveryOptionAccordionProductProps) {
  return (
    <div data-fs-delivery-option-accordion-product>
      <div data-fs-delivery-option-accordion-product-top>
        <div data-fs-delivery-option-accordion-product-image>
          <img src={image} alt={name} />
          <span data-fs-delivery-option-accordion-product-quantity>
            {quantity}
          </span>
        </div>
        <div data-fs-delivery-option-accordion-product-details>
          <p>{name}</p>
          {field && (
            <span>{`${camelCaseToTitle(field.name)}: ${field.value ?? ''}`}</span>
          )}
        </div>
      </div>
      <div data-fs-delivery-option-accordion-product-bottom>
        <div data-fs-delivery-option-accordion-product-price>
          <p>{price}</p>
          <span>{labels.eachLabel}</span>
        </div>
        <div data-fs-delivery-option-accordion-product-tax>
          <p>{tax}</p>
          <span>{labels.taxesLabel}</span>
        </div>
        <div data-fs-delivery-option-accordion-product-total>
          <p>{total}</p>
          <span>{labels.totalLabel}</span>
        </div>
      </div>
    </div>
  )
}

interface DeliveryOptionAccordionProductsProps {
  children: ReactNode
}

function DeliveryOptionAccordionProducts({
  children,
}: DeliveryOptionAccordionProductsProps) {
  return <div data-fs-delivery-option-accordion-products>{children}</div>
}

export { DeliveryOptionAccordionProduct, DeliveryOptionAccordionProducts }
