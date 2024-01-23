import { Spacer, Summary, FinishOrder, Coupon } from '../ui'
import { ProductList } from './components'
import { OrderFormProvider, useOrderForm } from './utils/order-form'
import {
  RenderManagerProvider,
  useRemoteRenderer,
  ExtensionPoint,
} from './remote-render'
import { useEffect, useState } from 'react'
import { getOverridableSection } from 'src/sdk/overrides/getOverriddenSection'

function MainCheckout() {
  const { orderForm } = useOrderForm()
  const [state, setState] = useState(true)
  const worker = useRemoteRenderer()

  // Just a little trick for poc-only purposes 😂
  // useEffect(() => {
  //   setTimeout(() => {
  //     setState(true)
  //   }, 300)
  // })

  if (!state) return null

  return (
    <OrderFormProvider>
      <RenderManagerProvider>
        <main className="flex h-full flex-col main-fadein-container">
          <ExtensionPoint extension="Root" worker={worker} />
          <div className="flex flex-grow flex-col lg:flex-row">
            <div className="min-h-full flex-grow px-5 pt-10 md:px-16 md:pt-16 lg:w-2/3 lg:flex-grow-0 lg:px-5 xl:px-16">
              {/* <ExtensionPoint extension="BeforeCartTitle" /> */}
              <header className="pb-3 md:pb-4">
                <h1
                  className="text-text-primary md:tracking-tightest text-2xl font-semibold leading-7 tracking-tight md:text-3xl md:leading-8"
                  data-testid="cart-title"
                >
                  Carrinho
                </h1>
                <p
                  className="text-text-secondary md:tracking-tightest text-2xl leading-7 tracking-tight md:text-2xl md:leading-8 mt-1"
                  data-testid="cart-quantity-items"
                >
                  {orderForm.items.length === 1
                    ? '1 item'
                    : `${orderForm.items.length} itens`}
                </p>
              </header>
              {/* <ExtensionPoint extension="BeforeCartList" /> */}
              <main>
                <ProductList
                  products={orderForm.items}
                  onProductQuantityChange={console.log}
                />
                <Spacer size="lg" />
              </main>

              {/* <ExtensionPoint extension="Footer" /> */}
            </div>

            <aside className="bg-sidebar z-2 relative p-6 md:px-16 lg:sticky lg:top-0 lg:max-h-screen lg:w-1/3 lg:flex-grow lg:px-5 lg:will-change-transform xl:px-16">
              <span className="bg-brand-secondary pointer-events-none absolute left-0 right-0 -top-72 hidden h-72 lg:block" />
              {/* <ExtensionPoint extension="BeforeSummary" /> */}
              <Summary
                coupon={
                  <ExtensionPoint
                    extension="CouponButton"
                    element={<Coupon />}
                    worker={worker}
                  />
                }
                total={orderForm.value}
                totalizers={orderForm.totalizers}
                loadingTotal={false}
              />
              <Spacer size="sm" />
              {/* <ExtensionPoint extension="AfterSummary" /> */}
              <Spacer size="sm" />
              <div
                className="h-12 md:h-14 lg:hidden"
                data-testid="continue-button-placeholder"
              />
              <FinishOrder />
              {/* <ExtensionPoint extension="AfterFinishOrder" /> */}
            </aside>
          </div>
        </main>
      </RenderManagerProvider>
    </OrderFormProvider>
  )
}

const OverridableMainCheckout = getOverridableSection<typeof MainCheckout>(
  'MainCheckout',
  MainCheckout,
  {
    Root: () => <></>,
    BeforeCartTitle: () => <></>,
    BeforeCartList: () => <></>,
    Footer: () => <></>,
    BeforeSummary: () => <></>,
    CouponButton: () => <></>,
    AfterSummary: () => <></>,
    AfterFinishOrder: () => <></>,
  }
)

export default OverridableMainCheckout
