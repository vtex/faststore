import {
  complexAssemblyOptionsOrderForm,
  emptyOrderForm,
  noAssemblyOptionsOrderForm,
  oneLevelAssemblyOptionsOrderForm,
  testContext,
  twoLevelsAssemblyOptionsOrderForm,
} from '../mocks/OrderResolver'
import { StoreOrder } from '../src/platforms/vtex/resolvers/order'

const getAcceptedOffer = (orderForm: any) =>
  StoreOrder.acceptedOffer(orderForm, null, testContext as any, null)

describe('VTEX Order resolver', () => {
  it('No accepted offers should be returned when no items are provided', () => {
    const acceptedOffer = getAcceptedOffer(emptyOrderForm)

    expect(acceptedOffer).toEqual([])
  })

  it('Accepted offers with no addOns should be returned in case item.parentItemIndex are all null', () => {
    const acceptedOffer = getAcceptedOffer(noAssemblyOptionsOrderForm)

    expect(acceptedOffer).toEqual([
      {
        id: '0',
        product: null,
        parentItemIndex: null,
        addOn: undefined,
      },
      {
        id: '1',
        product: null,
        addOn: undefined,
        parentItemIndex: null,
      },
      {
        id: '2',
        product: null,
        addOn: undefined,
        parentItemIndex: null,
      },
      {
        id: '3',
        product: null,
        addOn: undefined,
        parentItemIndex: null,
      },
    ])
  })

  it('Accepted offers should have addOns if item.parentItemIndex is different from null', () => {
    const acceptedOffer = getAcceptedOffer(oneLevelAssemblyOptionsOrderForm)

    expect(acceptedOffer).toEqual([
      {
        id: '0',
        product: null,
        parentItemIndex: null,
        addOn: [
          {
            id: '1',
            product: null,
            addOn: undefined,
            parentItemIndex: 0,
          },
          {
            id: '2',
            product: null,
            addOn: undefined,
            parentItemIndex: 0,
          },
          {
            id: '3',
            product: null,
            addOn: undefined,
            parentItemIndex: 0,
          },
        ],
      },
    ])
  })

  it('Accepted offers should second level addOn if addOn itself has its own addOns', () => {
    const acceptedOffer = getAcceptedOffer(twoLevelsAssemblyOptionsOrderForm)

    expect(acceptedOffer).toEqual([
      {
        id: '0',
        product: null,
        parentItemIndex: null,
        addOn: [
          {
            id: '1',
            product: null,
            addOn: [
              {
                id: '3',
                product: null,
                addOn: undefined,
                parentItemIndex: 1,
              },
            ],
            parentItemIndex: 0,
          },
          {
            id: '2',
            product: null,
            addOn: undefined,
            parentItemIndex: 0,
          },
        ],
      },
    ])
  })

  it('Accepted offers should remount complex addOns tree', () => {
    const acceptedOffer = getAcceptedOffer(complexAssemblyOptionsOrderForm)

    expect(acceptedOffer).toEqual([
      {
        id: '0',
        product: null,
        parentItemIndex: null,
        addOn: [
          {
            id: '1',
            product: null,
            addOn: [
              {
                id: '3',
                product: null,
                addOn: [
                  {
                    id: '4',
                    product: null,
                    addOn: undefined,
                    parentItemIndex: 3,
                  },
                ],
                parentItemIndex: 1,
              },
            ],
            parentItemIndex: 0,
          },
          {
            id: '2',
            product: null,
            addOn: undefined,
            parentItemIndex: 0,
          },
        ],
      },
      {
        id: '5',
        product: null,
        parentItemIndex: null,
        addOn: [
          {
            id: '6',
            product: null,
            addOn: [
              {
                id: '9',
                product: null,
                addOn: undefined,
                parentItemIndex: 6,
              },
            ],
            parentItemIndex: 5,
          },
          {
            id: '7',
            product: null,
            addOn: [
              {
                id: '10',
                product: null,
                addOn: undefined,
                parentItemIndex: 7,
              },
            ],
            parentItemIndex: 5,
          },
        ],
      },
      {
        id: '8',
        product: null,
        addOn: undefined,
        parentItemIndex: null,
      },
    ])
  })
})
