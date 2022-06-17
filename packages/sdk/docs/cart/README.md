## Cart

The cart module lets you manage a platform agnostic, marketplace/coupon/gift/promotion ready cart for your next ecommerce. The cart state is saved on the browser's IndexedDB for supporting large orders. Also, the cart has an `optimistic` mode where the cart state can be validated by a server using debounced requests for smaller server loads.

### Pure cart

The `pure` mode is the simplest way of using the cart because it works entirely in the browser. The `pure` name was inspired in functional programming and stands for not causing side effects in the system. For every change to the cart, we store the cart's state in the browser's IndexedDB. Next time the user opens the site, their cart will hydrate from its last state.
To use the cart, you need to add our cart provider and call the `useCart` hook like:

```tsx
import { CartProvider, useCart } from '@faststore/sdk'

// In the App's root component:
const App = ({ children }) => {
  return <CartProvider>{children}</CartProvider>
}

// In your component:
const MyComponent = () => {
  const { items } = useCart()

  return <div>Number of items on cart: {items.length}</div>
}
```

### Optimistic mode

The `optimistic` mode may cause side effects. This mode gives the developer a callback function where the developer can make requests and cause side effects to the cart. If this function returns `null`, this means the cart is good and nothing will be changed. If the developer wishes to change the state of the cart, he needs to return the new cart state on this function.
To use the optimistic cart:

```tsx
import { CartProvider, useCart, Cart } from '@faststore/sdk'

// In the App's root component:
const validateCart = async (cart: Cart) => {
   const response = await fetch(...)

   if (response) {
     return response
   }

   return null
}

const App = ({children}) => {
  return <CartProvider mode="optimistic" onValidateCart={validateCart}>{children}</CartProvider>
}

// In your component:
const MyComponent = () => {
  const { items, isValidating } = useCart()

  if (isValidating) {
     return <div>Cart is validating</div>
  }

  return <div>Number items in cart: {items.length}</div>
}
```
