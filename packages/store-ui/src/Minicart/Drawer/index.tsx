import Drawer from '@vtex-components/drawer'
import React from 'react'
import type { DrawerProps } from '@vtex-components/drawer'
import type { PropsWithChildren, ComponentPropsWithoutRef } from 'react'

import MinicartDrawerContent from './Content'
import MinicartDrawerFooter from './Footer'
import MinicartDrawerHeader from './Header'
import type { Props as MinicartDrawerContentProps } from './Content'
import type { Item } from '../types'

export interface Props<T extends Item>
  extends DrawerProps,
    Pick<
      MinicartDrawerContentProps<T>,
      'removeItem' | 'updateItem' | 'numberFormat' | 'items'
    >,
    Pick<
      ComponentPropsWithoutRef<typeof MinicartDrawerFooter>,
      'onCheckout' | 'total' | 'subTotal' | 'numberFormat'
    > {
  variant: string
}

const MinicartDrawer = <T extends Item>({
  isOpen,
  variant,
  items,
  total,
  subTotal,
  onClose,
  removeItem,
  updateItem,
  numberFormat,
  onCheckout,
}: PropsWithChildren<Props<T>>) => {
  const customVariant = `minicart.${variant}.drawer`

  return (
    <Drawer
      variant={variant}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      width={400}
    >
      <MinicartDrawerHeader
        onClose={onClose}
        count={items.length}
        variant={customVariant}
      />
      <MinicartDrawerContent
        variant={customVariant}
        items={items}
        removeItem={removeItem}
        updateItem={updateItem}
        numberFormat={numberFormat}
      />
      <MinicartDrawerFooter
        total={total}
        subTotal={subTotal}
        variant={customVariant}
        onCheckout={onCheckout}
        numberFormat={numberFormat}
      />
    </Drawer>
  )
}

export default MinicartDrawer
