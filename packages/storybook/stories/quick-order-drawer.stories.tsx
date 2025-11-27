import {
  QuickOrderDrawer,
  QuickOrderDrawerFooter,
  QuickOrderDrawerHeader,
  QuickOrderDrawerProducts,
  UIProvider,
} from '@faststore/ui'
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

export function Default() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Quick Order Drawer</button>
      <QuickOrderDrawer isOpen={isOpen}>
        <>
          <QuickOrderDrawerHeader
            title="order-file.xlsx"
            onCloseDrawer={() => setIsOpen(false)}
          />
          <QuickOrderDrawerProducts columns={columns} />
          <QuickOrderDrawerFooter />
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
      <QuickOrderDrawer isOpen={isOpen}>
        <QuickOrderDrawerHeader
          title="abcdefghijklmnopqrstuvwxyz1234567890.xlsx"
          onCloseDrawer={() => setIsOpen(false)}
        />
        <QuickOrderDrawerProducts columns={columns} />
        <QuickOrderDrawerFooter />
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
      <QuickOrderDrawer isOpen={isOpen}>
        <QuickOrderDrawerHeader
          title="order-file.xlsx"
          onCloseDrawer={() => setIsOpen(false)}
        />
        <QuickOrderDrawerProducts columns={columnsWithStock} />
        <QuickOrderDrawerFooter />
      </QuickOrderDrawer>
    </div>
  )
}

export function OpenByDefault() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Quick Order Drawer</button>
      <QuickOrderDrawer isOpen={isOpen}>
        <QuickOrderDrawerHeader
          title="order-file.xlsx"
          onCloseDrawer={() => setIsOpen(false)}
        />
        <QuickOrderDrawerProducts columns={columns} />
        <QuickOrderDrawerFooter />
      </QuickOrderDrawer>
    </div>
  )
}
