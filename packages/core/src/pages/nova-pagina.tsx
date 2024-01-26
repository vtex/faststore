import {
  Breadcrumb,
  Button,
  DiscountBadge,
  OrderSummary,
  ProductPrice,
  Select,
} from '@faststore/ui'

import styles from './nova-pagina.module.scss'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

const breadcrumbList = [
  {
    item: '/cart/',
    name: 'Cart',
    position: 5,
  },
  {
    item: '/information',
    name: 'Information',
    position: 2,
  },
  {
    item: '/delivery',
    name: 'Delivery',
    position: 3,
  },
  {
    item: '/payment',
    name: 'Payment',
    position: 4,
  },
]

function Page() {
  return (
    <div className={`section ${styles.section} section-checkout`}>
      <div data-fs-checkout-content>
        <Breadcrumb breadcrumbList={breadcrumbList} />
        <header data-fs-checkout-header data-fs-content="checkout">
          <h2>Cart</h2>
          <span>
            <p>18 items – $101.84</p>
            <Button variant="tertiary" size="small">
              Clear all
            </Button>
          </span>
        </header>
        <ul data-fs-checkout-products-list data-fs-content="checkout">
          <li data-fs-checkout-product>
            <div data-fs-checkout-product-removable>
              <span data-fs-checkout-product-image></span>
              <Button variant="secondary" size="small">
                Remove
              </Button>
            </div>
            <div data-fs-checkout-product-content>
              <div data-fs-checkout-product-title>
                <DiscountBadge listPrice={45} spotPrice={40} />
                <h4>Litehouse Homestyle Ranch Dressing</h4>
              </div>
              <div data-fs-checkout-product-values>
                <Select
                  id="select-overview-default"
                  options={{
                    1: '1',
                    2: '2',
                    3: '3',
                    4: '4',
                    5: '5',
                  }}
                />
                <ProductPrice
                  value={950.04}
                  listPrice={999}
                  formatter={useFormattedPrice}
                />
              </div>
            </div>
          </li>
          <li data-fs-checkout-product>
            <div data-fs-checkout-product-removable>
              <span data-fs-checkout-product-image></span>
              <Button variant="secondary" size="small">
                Remove
              </Button>
            </div>
            <div data-fs-checkout-product-content>
              <div data-fs-checkout-product-title>
                <DiscountBadge listPrice={45} spotPrice={40} />
                <h4>Litehouse Homestyle Ranch Dressing</h4>
              </div>
              <div data-fs-checkout-product-values>
                <Select
                  id="select-overview-default"
                  options={{
                    1: '1',
                    2: '2',
                    3: '3',
                    4: '4',
                    5: '5',
                  }}
                />
                <ProductPrice
                  value={950.04}
                  listPrice={999}
                  formatter={useFormattedPrice}
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <aside data-fs-checkout-aside>
        <div data-fs-checkout-aside-content>
          <section data-fs-checkout-aside-section>
            <header>
              <h3 data-fs-checkout-subtitle>Delivery address</h3>
              <Button variant="tertiary" size="small">
                Edit
              </Button>
            </header>
            <p>64 Florida Avenue</p>
          </section>
          <section data-fs-checkout-aside-section>
            <header>
              <h3 data-fs-checkout-subtitle>Promo code</h3>
              <Button variant="tertiary" size="small">
                Add
              </Button>
            </header>
          </section>
        </div>
        <footer>
          <h3 data-fs-checkout-subtitle>Order Summary</h3>
          <OrderSummary
            subtotalLabel="Subtotal (3 products)"
            subtotalValue="$1200"
            discountValue="-$100"
            totalValue="$1100"
          />
          <Button variant="primary">Continue</Button>
        </footer>
      </aside>
    </div>
  )
}

export default Page
