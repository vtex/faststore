---
id: cart
keywords: [cart, minicart, checkout]
---

# Cart

The Cart module offers all the functionalities necessary to handle your store's shopping cart. It supports large orders and complex ecommerce operations, such as the ones that provide marketplace, coupon, gift, and promotion options.  The Cart state is saved on the browser's [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) and is structured as in the following.

![Cart SDK diagram](/img/references/Cart.png)


The Cart module provides two modes: 
- **Pure** (default) -  works entirely on the client-side.
- **Optimistic** - validates the cart state on the server-side using debounce requests to make the app more responsive and reduce data traffic on the users' device.

## Pure cart

In the Pure mode, the shopping cart works entirely on the client-side. Hence, every time a user changes their shopping cart, the new cart's state is stored in the browser's IndexedDB. This way, the next time the user opens your store website, their cart will hydrate from its last state. 

Notice that, because of how it was built, the Pure cart can also work offline. However, the Pure cart is deterministic, meaning that, given an input, it always returns the same output. Hence, the Pure mode can't cause side effects on the commerce platform to correct undesired behaviors such as adding unavailable items to the cart.

To use the Pure cart, you must use the `CartProvider` component and call the `useCart` hook as in the following example:

```tsx
import { CartProvider, useCart } from '@faststore/sdk'

// In the App's root component:
const App = ({children}) => {
  return <CartProvider>{children}</CartProvider>
}

// In your component:
const MyComponent = () => {
  const { items } = useCart()
  
  return <div>Number of items on cart: {items.length}</div>
}
```

## Optimistic mode

The Optimistic cart can manage undesired behaviors not addressed by the Pure cart by handling side effects. For example, the Optimistic cart can handle unavailable items added to the cart by notifying the buyers that the item is no longer available and automatically removing it from the cart.

This feature can be implemented in the `optimistic` mode via a callback function that allows developers to make requests and cause side effects to the cart. If the function returns `null`, the cart behavior does not change. However, if the developer opts to change the state of the cart to handle some specific side effect, they must return the new cart state on the callback function.

To use the Optimistic cart, you must use the `CartProvider` component with the `optimistic` mode and call the `validateCart` function as in the following example:

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
