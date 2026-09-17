import '@testing-library/jest-dom/vitest'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockUseAccountPageData = vi.hoisted(() => vi.fn())
const mockListOrders = vi.hoisted(() => vi.fn(() => null))

vi.mock('src/sdk/account/accountPageContext', () => ({
  useAccountPageData: mockUseAccountPageData,
}))
vi.mock('src/components/account/orders/ListOrders', () => ({
  ListOrders: mockListOrders,
}))

import AccountOrdersList from 'src/components/sections/Account/AccountOrdersList'

const pageData = {
  listOrders: { list: [] },
  total: 0,
  perPage: 10,
  filters: {
    page: 1,
    status: [],
    dateInitial: '',
    dateFinal: '',
    text: '',
    clientEmail: '',
  },
}

afterEach(() => {
  cleanup()
  mockListOrders.mockClear()
})

describe('AccountOrdersList', () => {
  it('forwards the default filter group labels', () => {
    mockUseAccountPageData.mockReturnValueOnce(pageData)

    render(<AccountOrdersList />)

    expect(mockListOrders.mock.calls[0][0].labels).toMatchObject({
      statusFilterLabel: 'Status',
      orderDateFilterLabel: 'Order Date',
    })
  })

  it('forwards the CMS filter group labels', () => {
    mockUseAccountPageData.mockReturnValueOnce(pageData)

    render(
      <AccountOrdersList
        statusFilterLabel="Situação"
        orderDateFilterLabel="Data do pedido"
      />
    )

    expect(mockListOrders.mock.calls[0][0].labels).toMatchObject({
      statusFilterLabel: 'Situação',
      orderDateFilterLabel: 'Data do pedido',
    })
  })
})
