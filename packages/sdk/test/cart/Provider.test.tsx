/* eslint-disable react/display-name */
import { act, renderHook } from "@testing-library/react-hooks";
import { set } from "idb-keyval";

import { Cart, CartItem, createCartStore, useStore } from "../../src";

beforeEach(() => set(`fs::cart`, null))

const item: CartItem = {
  id: 'test',
  quantity: 1,
}

const cart: Cart<CartItem> = {
  id: '',
  items: [],
}

describe('CartProvider', () => {
  it('uses default ID for cart if not provided', () => {
    const store = createCartStore(cart)

    const { result } = renderHook(useStore, { initialProps: store })

    expect(result.current.id).toBeDefined()
    expect(result.current.id).toEqual('')
  })

  it('initial cart meta state is set', () => {
    const store = createCartStore(cart)

    const { result } = renderHook(useStore, { initialProps: store })

    expect(result.current.items).toEqual([])
    expect(store.isEmpty()).toBe(true)
  })

  it('uses ID for cart if provided', () => {
    const store = createCartStore({ ...cart, id: 'test' })

    const { result } = renderHook(useStore, { initialProps: store })

    expect(result.current.id).toBeDefined()
    expect(result.current.id).toEqual('test')
  })
})

describe('addItem', () => {
  it('adds item to the cart', () => {
    const store = createCartStore(cart)

    const { result } = renderHook(useStore, { initialProps: store })

    act(() => store.addItem(item))

    expect(result.current.items).toHaveLength(1)

    act(() => store.addItem(item))

    expect(result.current.items).toHaveLength(1)
  })

  it('increments existing item quantity in the cart', () => {
    const store = createCartStore(cart)
    const { result } = renderHook(useStore, { initialProps: store })

    act(() => store.addItem(item))
    act(() => store.addItem(item))

    expect(result.current.items).toHaveLength(1)
  })

  it('has gifts', () => {
    const store = createCartStore(cart)
    const { result } = renderHook(useStore, { initialProps: store })

    act(() => store.addItem({ ...item, quantity: 0 }))

    expect(result.current.items).toHaveLength(1)
    expect(store.isEmpty()).toBe(false)
  })
})

describe('updateItemQuantity', () => {
  it('triggers onItemUpdate when cart has existing item', () => {
    const store = createCartStore({
      id: '',
      items: [item],
    })

    const { result } = renderHook(useStore, {
      initialProps: store,
    })

    expect(result.current.items).toHaveLength(1)

    act(() => {
      store.updateItemQuantity(item.id, 0)
    })

    expect(result.current.items).toHaveLength(1)
  })

  it('recalculates State when incrementing item quantity', () => {
    const store = createCartStore(cart)
    const { result } = renderHook(useStore, { initialProps: store })

    act(() => store.addItem(item))
    act(() => store.updateItemQuantity(item.id, 2))

    expect(result.current.items).toHaveLength(1)
  })
})

describe('removeItem', () => {
  const store = createCartStore(cart)

  const { result } = renderHook(useStore, {
    initialProps: store,
  })

  act(() => store.addItem(item))

  expect(result.current.items).toHaveLength(1)

  act(() => store.removeItem(item.id))

  expect(result.current.items).toHaveLength(0)
})

describe('emptyCart', () => {
  it('updates cart meta state', () => {
    const store = createCartStore(cart)
    const { result } = renderHook(useStore, {
      initialProps: store,
    })

    act(() => store.addItem(item))

    expect(result.current.items).toHaveLength(1)

    act(() => store.emptyCart())

    expect(result.current.items).toEqual([])
    expect(store.isEmpty()).toBe(true)
  })
})

describe('inCart', () => {
  it('should report items in cart', () => {
    const store = createCartStore(cart)

    renderHook(useStore, {
      initialProps: store,
    })

    act(() => store.addItem(item))

    expect(store.inCart(item.id)).toEqual(true)
    expect(store.inCart('notInCart')).toEqual(false)
  })
})

describe('getItem', () => {
  it('get items from cart', () => {
    const store = createCartStore(cart)

    renderHook(useStore, {
      initialProps: store,
    })

    act(() => store.addItem(item))
    expect(store.getItem('notInCart')).toBeUndefined()
  })
})

describe('gifts', () => {
  it('should allow adding gifts', () => {
    const store = createCartStore(cart)

    const { result } = renderHook(useStore, {
      initialProps: store,
    })

    act(() => store.addItem({ ...item, quantity: 0 }))

    expect(result.current.items).toHaveLength(1)

    act(() => store.removeItem(item.id))

    expect(result.current.items).toEqual([])
  })
})
