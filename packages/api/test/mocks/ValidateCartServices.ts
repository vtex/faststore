/**
 * Fixtures for `validateCart` with VTEX Services (Checkout "offerings").
 *
 * Line shape trimmed from a live orderForm, with account and product data
 * removed. Prices are in cents.
 */
import { md5 } from '../../src/platforms/vtex/utils/md5'
import type {
  Attachment,
  OrderFormBundleItem,
  OrderFormItem,
} from '../../src/platforms/vtex/clients/commerce/types/OrderForm'

export const ORDER_FORM_ID = 'edbe3b03c8c94827a37ec5a6a4648fd2'

const CHECKOUT_BASE = `https://storeframework.vtexcommercestable.com.br/api/checkout/pub/orderForm/${ORDER_FORM_ID}`

export const ORDER_FORM_URL = `${CHECKOUT_BASE}?refreshOutdatedData=true`
export const ITEMS_URL = `${CHECKOUT_BASE}/items?allowOutdatedData=paymentData&sc=1`
export const CART_ETAG_URL = `${CHECKOUT_BASE}/customData/faststore/cartEtag`

export const SKU = '3'
export const SKU_NAME = 'Sample product'
export const SELLING_PRICE = 699000
export const SERVICE_ID = '3'
export const SERVICE_NAME = 'Installation'
export const SERVICE_PRICE = 16999000

export const ValidateCartServicesMutation = `mutation ValidateCartServicesMutation($cart: IStoreCart!) {
  validateCart(cart: $cart) {
    messages {
      status
      text
    }
    order {
      orderNumber
      acceptedOffer {
        price
        listPrice
        quantity
        seller {
          identifier
        }
        itemOffered {
          sku
          additionalProperty {
            propertyID
            name
            value
            valueReference
          }
        }
      }
    }
  }
}
`

// ---------------------------------------------------------------------------
// Service key — re-derived here from the contract in the spec so the tests
// verify it independently of the implementation.
// ---------------------------------------------------------------------------

const byName = (a: Attachment, b: Attachment) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0

export const serviceKey = (id: string, attachments: Attachment[] = []) =>
  md5(`SERVICE:${id}:${JSON.stringify([...attachments].sort(byName))}`)

export const installationService = (
  overrides: Partial<OrderFormBundleItem> = {}
): OrderFormBundleItem => ({
  id: SERVICE_ID,
  name: SERVICE_NAME,
  quantity: 1,
  sellingPrice: SERVICE_PRICE,
  attachments: [],
  ...overrides,
})

export const INSTALLATION_KEY = serviceKey(SERVICE_ID)

// ---------------------------------------------------------------------------
// orderForm
// ---------------------------------------------------------------------------

type ItemOverrides = Partial<OrderFormItem> & {
  bundleItems?: OrderFormBundleItem[] | null
}

export const orderFormItem = ({
  quantity = 1,
  bundleItems = [],
  ...overrides
}: ItemOverrides = {}): OrderFormItem =>
  ({
    uniqueId: md5(`${SKU}:${quantity}:${JSON.stringify(bundleItems)}`),
    id: SKU,
    productId: '1',
    productRefId: '',
    refId: '',
    ean: '',
    name: SKU_NAME,
    skuName: SKU_NAME,
    parentItemIndex: null,
    parentAssemblyBinding: null,
    priceValidUntil: '2027-01-01T00:00:00Z',
    tax: 0,
    price: SELLING_PRICE,
    listPrice: SELLING_PRICE,
    manualPrice: null,
    sellingPrice: SELLING_PRICE,
    rewardValue: 0,
    isGift: false,
    additionalInfo: {
      brandName: 'Test Brand',
      brandId: '1',
      offeringInfo: null,
      offeringType: null,
      offeringTypeId: null,
    },
    productCategoryIds: '/1/',
    productCategories: { '1': 'Sample category' },
    quantity,
    seller: '1',
    sellerChain: ['1'],
    imageUrl: '',
    detailUrl: '/sample-product/p',
    attachments: [],
    attachmentOfferings: [],
    offerings: [
      {
        type: SERVICE_NAME,
        id: SERVICE_ID,
        name: SERVICE_NAME,
        allowGiftMessage: false,
        attachmentOfferings: [],
        price: SERVICE_PRICE,
      },
    ],
    priceTags: [],
    availability: 'available',
    measurementUnit: 'un',
    unitMultiplier: 1,
    priceDefinition: {
      calculatedSellingPrice: SELLING_PRICE,
      total: SELLING_PRICE * quantity,
      sellingPrices: [{ value: SELLING_PRICE, quantity }],
    },
    bundleItems,
    ...overrides,
  }) as OrderFormItem

type EtagItem = Pick<
  OrderFormItem,
  'id' | 'quantity' | 'seller' | 'attachments'
>

/** Etag as computed before this change (no `services` field). */
export const legacyEtag = (items: OrderFormItem[]) =>
  md5(
    JSON.stringify({
      sessionId: '',
      items: items.map(
        ({ id, quantity, seller, attachments }): EtagItem => ({
          id,
          quantity,
          seller,
          attachments,
        })
      ),
    })
  )

/** Etag per the spec: sorted service keys, present only for serviced lines. */
export const serviceAwareEtag = (items: OrderFormItem[]) =>
  md5(
    JSON.stringify({
      sessionId: '',
      items: items.map(({ id, quantity, seller, attachments, bundleItems }) => {
        const services = (bundleItems ?? [])
          .map((service) => serviceKey(service.id, service.attachments ?? []))
          .sort((a, b) => a.localeCompare(b))

        return {
          id,
          quantity,
          seller,
          attachments,
          ...(services.length > 0 ? { services } : {}),
        }
      }),
    })
  )

export const orderForm = (items: OrderFormItem[], cartEtag: string) => ({
  orderFormId: ORDER_FORM_ID,
  salesChannel: '1',
  loggedIn: false,
  isCheckedIn: false,
  storeId: null,
  checkedInPickupPointId: null,
  allowManualPrice: false,
  canEditData: true,
  userProfileId: null,
  userType: null,
  ignoreProfileData: false,
  value: items.reduce(
    (acc, item) =>
      acc +
      item.priceDefinition.total +
      (item.bundleItems ?? []).reduce((s, b) => s + b.sellingPrice, 0),
    0
  ),
  messages: [],
  items,
  selectableGifts: [],
  totalizers: [],
  shippingData: null,
  clientProfileData: null,
  paymentData: {
    installmentOptions: [],
    paymentSystems: [],
    payments: [],
    giftCards: [],
    giftCardMessages: [],
    availableAccounts: [],
    availableTokens: [],
  },
  marketingData: null,
  sellers: [{ id: '1', name: 'Store', logo: '' }],
  clientPreferencesData: { locale: 'en-US', optinNewsLetter: null },
  commercialConditionData: null,
  storePreferencesData: {
    countryCode: 'CHL',
    saveUserData: true,
    timeZone: 'Pacific SA Standard Time',
    currencyCode: 'CLP',
    currencyLocale: 13322,
    currencySymbol: '$',
    currencyFormatInfo: {
      currencyDecimalDigits: 0,
      currencyDecimalSeparator: ',',
      currencyGroupSeparator: '.',
      currencyGroupSize: 3,
      startsWithCurrencySymbol: true,
    },
  },
  giftRegistryData: null,
  openTextField: null,
  invoiceData: null,
  customData: {
    customApps: [{ fields: { cartEtag }, id: 'faststore', major: 1 }],
  },
  itemMetadata: null,
  hooksData: null,
  ratesAndBenefitsData: { rateAndBenefitsIdentifiers: [], teaser: [] },
  subscriptionData: null,
  itemsOrdination: null,
})

/** orderForm whose stored etag is fresh (written by this version of FastStore). */
export const freshOrderForm = (items: OrderFormItem[]) =>
  orderForm(items, serviceAwareEtag(items))

// ---------------------------------------------------------------------------
// Browser cart
// ---------------------------------------------------------------------------

export const servicePropertyInput = (
  service: OrderFormBundleItem = installationService()
) => ({
  propertyID: serviceKey(service.id, service.attachments ?? []),
  name: service.name,
  // The browser echoes the API's `ObjectOrString` serialization: a JSON string.
  value: JSON.stringify({
    id: service.id,
    price: service.sellingPrice / 100,
    attachments: service.attachments ?? [],
  }),
  valueReference: 'SERVICE',
})

export const browserLine = ({
  quantity = 1,
  seller = '1',
  services = [] as OrderFormBundleItem[],
  additionalProperty = services.map(servicePropertyInput),
}: {
  quantity?: number
  seller?: string
  services?: OrderFormBundleItem[]
  additionalProperty?: ReturnType<typeof servicePropertyInput>[]
} = {}) => ({
  price: SELLING_PRICE / 100,
  listPrice: SELLING_PRICE / 100,
  seller: { identifier: seller },
  quantity,
  itemOffered: {
    sku: SKU,
    image: [],
    name: SKU_NAME,
    additionalProperty,
  },
})

export const browserCart = (
  acceptedOffer: ReturnType<typeof browserLine>[]
) => ({
  order: {
    orderNumber: ORDER_FORM_ID,
    acceptedOffer,
  },
})

/** Browser line equivalent to an orderForm line (what the API would have returned). */
export const browserLineFor = (item: OrderFormItem) =>
  browserLine({
    quantity: item.quantity,
    seller: item.seller,
    services: item.bundleItems ?? [],
  })
