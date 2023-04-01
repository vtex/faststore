import React, { ReactNode } from 'react'

function CartSidebarFooter({ children }: { children: ReactNode }) {
  return (
    <footer data-fs-cart-sidebar-footer>
      Footer OrderSummary
      {children}
      {/* <OrderSummary
          subTotal={subTotal}
          total={total}
          numberOfItems={totalItems}
          checkoutButton={
            <UIButton
              data-fs-cart-sidebar-checkout-button
              variant="primary"
              icon={
                !isValidating && (
                  <Icon name="ArrowRight" width={18} height={18} />
                )
              }
              iconPosition="right"
              {...btnProps}
            >
              {isValidating ? 'Loading...' : 'Checkout'}
            </UIButton>
          }
        /> */}
    </footer>
  )
}

export default CartSidebarFooter
