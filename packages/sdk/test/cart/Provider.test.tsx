/* eslint-disable react/display-name */
import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { set } from 'idb-keyval'

import type { CartItem } from '../../src'
import { CartProvider, useCart } from '../../src'

beforeEach(() => set(`main::store::cart`, null))

const item: CartItem = {
  id: 'test',
  quantity: 1,
}

describe('CartProvider', () => {
  it('uses default ID for cart if not provided', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    })

    expect(result.current.id).toBeDefined()
    expect(result.current.id).toEqual('')
  })

  it('initial cart meta state is set', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    })

    expect(result.current.items).toEqual([])
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.isValidating).toBe(false)
  })

  it('uses ID for cart if provided', () => {
    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => (
        <CartProvider mode="pure" initialCart={{ id: 'test', items: {} }}>
          {children}
        </CartProvider>
      ),
    })

    expect(result.current.id).toBeDefined()
    expect(result.current.id).toEqual('test')
  })
})

describe('OptimisticCart', () => {
  it('revalidates cart', () => {
    const onValidateCart = jest.fn()

    return act(() => {
      const hook = renderHook(useCart, {
        wrapper: () => (
          <CartProvider mode="optimistic" onValidateCart={onValidateCart} />
        ),
      })

      return hook.waitFor(() => expect(onValidateCart).toHaveBeenCalled())
    })
  })

  it('does not revalidate on pure mode', () => {
    const onValidateCart = jest.fn()

    return act(() => {
      const hook = renderHook(useCart, {
        wrapper: () => (
          <CartProvider mode="pure" onValidateCart={onValidateCart} />
        ),
      })

      return hook.waitFor(() => expect(onValidateCart).not.toHaveBeenCalled())
    })
  })
})

describe('addItem', () => {
  it('adds item to the cart', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    })

    act(() => result.current.addItem(item))

    expect(result.current.items).toHaveLength(1)

    act(() => result.current.addItem(item))

    expect(result.current.items).toHaveLength(1)
  })

  it('increments existing item quantity in the cart', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    })

    act(() => result.current.addItem(item))
    act(() => result.current.addItem(item))

    expect(result.current.items).toHaveLength(1)
  })

  it('has gifts', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    })

    act(() => result.current.addItem({ ...item, quantity: 0 }))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.isEmpty).toBe(false)
  })

  it('triggers onItemAdd when cart empty', () => {
    const onItemAdd = jest.fn()

    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => (
        <CartProvider onItemAdd={onItemAdd}>{children}</CartProvider>
      ),
    })

    act(() => result.current.addItem(item))

    expect(onItemAdd).toHaveBeenCalled()
  })
})

describe('updateItemQuantity', () => {
  it('triggers onItemUpdate when cart has existing item', () => {
    const onItemUpdate = jest.fn()

    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => (
        <CartProvider
          initialCart={{
            id: '',
            items: {
              test: item,
            },
          }}
          onItemUpdate={onItemUpdate}
        >
          {children}
        </CartProvider>
      ),
    })

    expect(result.current.items).toHaveLength(1)

    act(() => {
      result.current.updateItemQuantity(item.id, 0)
    })

    expect(result.current.items).toHaveLength(1)
    expect(onItemUpdate).toHaveBeenCalled()
  })

  it('recalculates State when incrementing item quantity', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    })

    act(() => result.current.addItem(item))
    act(() => result.current.updateItemQuantity(item.id, 2))

    expect(result.current.items).toHaveLength(1)
  })
})

describe('removeItem', () => {
  it('triggers onItemRemove when removing item', () => {
    const onItemRemove = jest.fn()

    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => (
        <CartProvider onItemRemove={onItemRemove}>{children}</CartProvider>
      ),
    })

    act(() => result.current.addItem(item))

    expect(result.current.items).toHaveLength(1)

    act(() => result.current.removeItem(item.id))

    expect(onItemRemove).toHaveBeenCalled()
    expect(result.current.items).toHaveLength(0)
  })
})

describe('emptyCart', () => {
  it('updates cart meta state', () => {
    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    })

    act(() => result.current.addItem(item))

    expect(result.current.items).toHaveLength(1)

    act(() => result.current.emptyCart())

    expect(result.current.items).toEqual([])
    expect(result.current.isEmpty).toBe(true)
  })
})

describe('inCart', () => {
  it('should report items in cart', () => {
    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    })

    act(() => result.current.addItem(item))

    expect(result.current.inCart(item.id)).toEqual(true)
    expect(result.current.inCart('notInCart')).toEqual(false)
  })
})

describe('getItem', () => {
  it('get items from cart', () => {
    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    })

    act(() => result.current.addItem(item))
    expect(result.current.getItem('notInCart')).toBeUndefined()
  })
})

describe('gifts', () => {
  it('should allow adding gifts', () => {
    const { result } = renderHook(useCart, {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    })

    act(() => result.current.addItem({ ...item, quantity: 0 }))

    expect(result.current.items).toHaveLength(1)

    act(() => result.current.removeItem(item.id))

    expect(result.current.items).toEqual([])
  })
})
