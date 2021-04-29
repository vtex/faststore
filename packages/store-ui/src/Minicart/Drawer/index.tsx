import Drawer from '@vtex-components/drawer'
import React from 'react'
import type { DrawerProps } from '@vtex-components/drawer'
import type { PropsWithChildren, ComponentPropsWithoutRef } from 'react'

import MinicartDrawerContent from './Content'
import MinicartDrawerFooter from './Footer'
import MinicartDrawerHeader from './Header'
import MinicartDrawerToast from './Toast'
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
      'onCheckout' | 'total' | 'subTotal' | 'numberFormat' | 'disableViewCart'
    >,
    Pick<
      ComponentPropsWithoutRef<typeof MinicartDrawerToast>,
      'hideToast' | 'type'
    > {
  message: string
  variant?: string
}

const MinicartDrawer = <T extends Item>({
  isOpen,
  items,
  total,
  subTotal,
  onClose,
  removeItem,
  updateItem,
  numberFormat,
  onCheckout,
  hideToast,
  disableViewCart,
  type,
  message,
  variant = 'default',
}: PropsWithChildren<Props<T>>) => {
  const drawerVariant = `minicart.${variant}`
  const customVariant = `minicart.${variant}.drawer`

  return (
    <Drawer
      variant={drawerVariant}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      width={400}
    >
      <MinicartDrawerHeader
        variant={customVariant}
        onClose={onClose}
        count={items.length}
      />
      <MinicartDrawerContent
        variant={customVariant}
        items={items}
        removeItem={removeItem}
        updateItem={updateItem}
        numberFormat={numberFormat}
      />
      <MinicartDrawerToast
        hideToast={hideToast}
        content={message}
        type={type}
      />
      <MinicartDrawerFooter
        total={total}
        variant={customVariant}
        subTotal={subTotal}
        onCheckout={onCheckout}
        numberFormat={numberFormat}
        disableViewCart={disableViewCart}
      />
    </Drawer>
  )
}

export default MinicartDrawer
