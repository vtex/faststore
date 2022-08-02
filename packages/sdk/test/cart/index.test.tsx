import { set } from 'idb-keyval'

import { Cart, CartItem, createCartStore } from '../../src'
import { waitFor } from '../waitFor'

const item: CartItem = {
  id: 'test',
  quantity: 1,
}

const initialCart: Cart<CartItem> = {
  id: '',
  items: [],
}

const store = createCartStore(initialCart)

beforeEach(async () => {
  set(`fs::cart`, null)

  store.set(initialCart)

  await waitFor(() => expect(store.read()).toEqual(initialCart))
})

describe('CartStore', () => {
  it('uses initial cart state', () => {
    expect(store.read()).toEqual(initialCart)
  })

  it('initial cart meta state is set', () => {
    expect(store.isEmpty()).toBe(true)
  })
})

describe('addItem', () => {
  it('adds item to the cart', () => {
    store.addItem(item)

    expect(store.read().items).toHaveLength(1)

    store.addItem(item)

    expect(store.read().items).toHaveLength(1)
  })

  it('should not increment existing item quantity in the cart', () => {
    store.addItem(item)
    store.addItem(item)

    expect(store.read().items).toHaveLength(1)
  })
})

describe('updateItemQuantity', () => {
  it('removes item from cart when updating quantity to zero', async () => {
    const cart = {
      id: '',
      items: [item],
    }

    store.set(cart)

    await waitFor(() => expect(store.read()).toEqual(cart))

    expect(store.read().items).toHaveLength(1)

    store.updateItemQuantity(item.id, 0)

    expect(store.read().items).toHaveLength(0)
  })

  it('recalculates State when incrementing item quantity', () => {
    store.addItem(item)
    store.updateItemQuantity(item.id, 2)

    expect(store.read().items).toHaveLength(1)
    expect(store.read().items[0].quantity).toEqual(2)
  })
})

describe('removeItem', () => {
  store.addItem(item)

  expect(store.read().items).toHaveLength(1)

  store.removeItem(item.id)

  expect(store.read().items).toHaveLength(0)
})

describe('emptyCart', () => {
  it('updates cart meta state', () => {
    store.addItem(item)

    expect(store.read().items).toHaveLength(1)

    store.emptyCart()

    expect(store.read().items).toEqual([])
    expect(store.isEmpty()).toBe(true)
  })
})

describe('inCart', () => {
  it('should report items in cart', () => {
    store.addItem(item)

    expect(store.inCart(item.id)).toEqual(true)
    expect(store.inCart('notInCart')).toEqual(false)
  })
})

describe('getItem', () => {
  it('should not get non existing items from cart', () => {
    store.addItem(item)
    expect(store.getItem('notInCart')).toBeUndefined()
  })
})
