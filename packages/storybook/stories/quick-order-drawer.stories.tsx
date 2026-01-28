import {
  QuickOrderDrawer,
  QuickOrderDrawerFooter,
  QuickOrderDrawerHeader,
  QuickOrderDrawerProducts,
  UIProvider,
  useQuickOrderDrawer,
} from '@faststore/components'
import React, { useState } from 'react'

export default {
  title: 'QuickOrderDrawer',
  decorators: [
    (Story: React.ComponentType) => (
      <UIProvider>
        <Story />
      </UIProvider>
    ),
  ],
}

const columns = {
  name: 'Product',
  availability: {
    label: 'Availability',
    stockDisplaySettings: 'showAvailability' as const,
  },
  price: 'Price',
  quantity: 'Quantity',
}

// Wrapper component to provide labels with dynamic itemsCount
const QuickOrderDrawerFooterWithLabels = () => {
  const { itemsCount } = useQuickOrderDrawer()
  const labels = {
    itemsLabel: 'items',
    addToCartLabel: 'Add to Cart',
    addToCartAriaLabel: `Add ${itemsCount} items to cart`,
  }

  return <QuickOrderDrawerFooter labels={labels} />
}

const messages = {
  invalidQuantityTitle: 'Invalid quantity!',
  invalidQuantityMessage: (min: number, max: number, quantity: number) =>
    `The quantity you entered is outside the range of ${min} to ${max}. The quantity was set to ${quantity}.`,
}

const initialAlertMessage =
  'Some of the SKUs are not available. Please adjust the amount before proceeding to the cart.'

export function Default() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Quick Order Drawer</button>
      <QuickOrderDrawer
        isOpen={isOpen}
        initialAlertMessage={initialAlertMessage}
      >
        <>
          <QuickOrderDrawerHeader
            title="order-file.xlsx"
            onCloseDrawer={() => setIsOpen(false)}
          />
          <QuickOrderDrawerProducts columns={columns} messages={messages} />
          <QuickOrderDrawerFooterWithLabels />
        </>
      </QuickOrderDrawer>
    </div>
  )
}

export function WithLongTitle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Quick Order Drawer</button>
      <QuickOrderDrawer
        isOpen={isOpen}
        initialAlertMessage={initialAlertMessage}
      >
        <QuickOrderDrawerHeader
          title="abcdefghijklmnopqrstuvwxyz1234567890.xlsx"
          onCloseDrawer={() => setIsOpen(false)}
        />
        <QuickOrderDrawerProducts columns={columns} messages={messages} />
        <QuickOrderDrawerFooterWithLabels />
      </QuickOrderDrawer>
    </div>
  )
}

export function WithStockQuantity() {
  const [isOpen, setIsOpen] = useState(false)

  const columnsWithStock = {
    ...columns,
    availability: {
      label: 'Stock',
      stockDisplaySettings: 'showStockQuantity' as const,
    },
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Quick Order Drawer</button>
      <QuickOrderDrawer
        isOpen={isOpen}
        initialAlertMessage={initialAlertMessage}
      >
        <QuickOrderDrawerHeader
          title="order-file.xlsx"
          onCloseDrawer={() => setIsOpen(false)}
        />
        <QuickOrderDrawerProducts
          columns={columnsWithStock}
          messages={messages}
        />
        <QuickOrderDrawerFooterWithLabels />
      </QuickOrderDrawer>
    </div>
  )
}

export function OpenByDefault() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Quick Order Drawer</button>
      <QuickOrderDrawer
        isOpen={isOpen}
        initialAlertMessage={initialAlertMessage}
      >
        <QuickOrderDrawerHeader
          title="order-file.xlsx"
          onCloseDrawer={() => setIsOpen(false)}
        />
        <QuickOrderDrawerProducts columns={columns} messages={messages} />
        <QuickOrderDrawerFooterWithLabels />
      </QuickOrderDrawer>
    </div>
  )
}
