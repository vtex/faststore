import { Button, Icon } from '@faststore/ui'
import Link from 'next/link'

import styles from '../FCCartPage/FCCartPage.module.scss'

function FCEmptyCart() {
  return (
    <div className={styles.fcEmptyCart}>
      <Icon name="ShoppingCart" width={56} height={56} />
      <h2>Your cart is empty</h2>
      <p>Discover our products and add something to your cart.</p>
      <Link href="/" passHref legacyBehavior>
        <Button variant="primary" as="a">
          Continue Shopping
        </Button>
      </Link>
    </div>
  )
}

export default FCEmptyCart
