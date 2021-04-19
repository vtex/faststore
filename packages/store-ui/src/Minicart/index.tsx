/**
 * This is a simple version of its business logic. The intent it to have
 * an example of the hooks and components so store implementors can tweek
 * and implement their own based on their own needs. However, this should
 * cover 80% of use cases.
 */

import React, { lazy, Suspense } from 'react'
import type { PropsWithChildren } from 'react'

import MinicartButton from './Button'
import type { Item } from './types'
import type { Props as DrawerProps } from './Drawer/index'

const MinicartDrawer = lazy(() => import('./Drawer'))

interface Props<T extends Item> extends Omit<DrawerProps<T>, 'onClose'> {
  isOpen: boolean
  variant: string
  toggle: () => void | Promise<void>
}

const Minicart = <T extends Item>({
  total,
  subTotal,
  isOpen,
  toggle,
  items = [],
  removeItem,
  updateItem,
  onCheckout,
  numberFormat,
  variant = 'default',
}: PropsWithChildren<Props<T>>) => (
  <>
    <MinicartButton variant={variant} onClick={toggle} value={items.length} />
    {isOpen && (
      <Suspense fallback={null}>
        <MinicartDrawer
          isOpen
          variant={variant}
          items={items}
          total={total}
          subTotal={subTotal}
          onClose={toggle}
          numberFormat={numberFormat}
          onCheckout={onCheckout}
          // TODO: React.lazy somehow breaks typescript's generics. We should find a way to remove this as any
          removeItem={removeItem as any}
          updateItem={updateItem as any}
        />
      </Suspense>
    )}
  </>
)

export default Minicart
