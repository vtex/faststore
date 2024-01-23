import { NewProduct } from '../../sdk/lib'
import { createContext, PropsWithChildren, useContext, useState } from 'react'

type ProductItem = {
  additionalInfo: {
    brandName: string
  }
  availability: string
  id: string
  index: number
  detailUrl: string
  imageUrl: string
  listPrice: number
  measurementUnit: string
  name: string
  price: number
  productId: string
  quantity: number
  sellingPrice: number
  skuName: string
  skuSpecifications: []
  uniqueId: 'SomeUniqueId0'
  seller: '0'
  attachmentOfferings: []
  attachments: []
  bundleItems: []
  offerings: []
  priceTags: []
  unitMultiplier: null
  isGift: false
}

type Totalizer = {
  id: string
  name: string
  value: number
}

type OrderForm = {
  orderFormId: string
  items: ProductItem[]
  messages: []
  totalizers: Totalizer[]
  clientProfileData: {
    email: string
    firstName: string
    lastName: string
  }
  canEditData: boolean
  value: number
  shipping: {
    deliveryOptions: []
  }
}

type Api = {
  orderForm: OrderForm
  addToCart: (newProduct: NewProduct) => void
}

export const initialOrderForm: OrderForm = {
  orderFormId: '123',
  items: [
    {
      additionalInfo: {
        brandName: 'Brand Store',
      },
      availability: 'available',
      id: '32',
      index: 0,
      detailUrl: '/0/p',
      imageUrl:
        'https://vtexgame1.vtexassets.com/arquivos/ids/155642-300-300?v=636626711744730000&width=300&height=300&aspect=true',
      listPrice: 1600,
      measurementUnit: 'un',
      name: 'Cerveja IPA',
      price: 1200,
      productId: '35',
      quantity: 1,
      sellingPrice: 1200,
      skuName: '600ml',
      skuSpecifications: [],
      uniqueId: 'SomeUniqueId0',
      seller: '0',
      attachmentOfferings: [],
      attachments: [],
      bundleItems: [],
      offerings: [],
      priceTags: [],
      unitMultiplier: null,
      isGift: false,
    },
    {
      additionalInfo: {
        brandName: 'Brand Store',
      },
      availability: 'available',
      id: '33',
      index: 0,
      detailUrl: '/1/p',
      imageUrl:
        'https://vtexgame1.vtexassets.com/arquivos/ids/155647-300-300?v=1777909098&width=300&height=300&aspect=true',
      listPrice: 9400,
      measurementUnit: 'un',
      name: 'Pião Três Cores',
      price: 5990,
      productId: '35',
      quantity: 1,
      sellingPrice: 5990,
      skuName: 'Tipo 2',
      skuSpecifications: [],
      uniqueId: 'SomeUniqueId0',
      seller: '0',
      attachmentOfferings: [],
      attachments: [],
      bundleItems: [],
      offerings: [],
      priceTags: [],
      unitMultiplier: null,
      isGift: false,
    },

    {
      additionalInfo: {
        brandName: 'Brand Store',
      },
      availability: 'available',
      id: '35',
      index: 0,
      detailUrl: '/2/p',
      imageUrl:
        'http://storecomponents.vteximg.com.br/arquivos/ids/155476-55-55/Frame-4.jpg?v=636793808441900000',
      listPrice: 32000,
      measurementUnit: 'un',
      name: 'Camisa Branca Manga Longa',
      price: 29990,
      productId: '35',
      quantity: 1,
      sellingPrice: 29990,
      skuName: 'Tamanho P',
      skuSpecifications: [],
      uniqueId: 'SomeUniqueId0',
      seller: '0',
      attachmentOfferings: [],
      attachments: [],
      bundleItems: [],
      offerings: [],
      priceTags: [],
      unitMultiplier: null,
      isGift: false,
    },
  ],
  messages: [],
  totalizers: [
    {
      id: 'Items',
      name: 'Items Total',
      value: 37000,
    },
  ],
  clientProfileData: {
    email: '***@vt**.**',
    firstName: 'U*e*',
    lastName: 'N*m*',
  },
  canEditData: false,
  value: 37000,
  shipping: {
    deliveryOptions: [],
  },
}

const OrderFormContext = createContext<Api>({
  orderForm: initialOrderForm,
  addToCart: () => {},
})

export const OrderFormProvider = ({ children }: PropsWithChildren) => {
  const [orderForm, setOrderForm] = useState(initialOrderForm)

  const addToCart = (newProduct: NewProduct) => {
    const newItem: ProductItem = {
      additionalInfo: {
        brandName: 'Brand Store',
      },
      availability: 'available',
      id: Math.random() + Math.random() + '',
      index: 0,
      detailUrl: '/0/p',
      imageUrl: newProduct.imageUrl,
      listPrice: newProduct.price,
      measurementUnit: 'un',
      name: newProduct.name,
      price: newProduct.price,
      productId: Math.random() + Math.random() + '',
      quantity: 1,
      sellingPrice: newProduct.price,
      skuName: newProduct.skuName,
      skuSpecifications: [],
      uniqueId: 'SomeUniqueId0',
      seller: '0',
      attachmentOfferings: [],
      attachments: [],
      bundleItems: [],
      offerings: [],
      priceTags: [],
      unitMultiplier: null,
      isGift: false,
    }
    setOrderForm((current) => ({
      ...current,
      items: [...current.items, newItem],
    }))
  }

  return (
    <OrderFormContext.Provider value={{ addToCart, orderForm }}>
      {children}
    </OrderFormContext.Provider>
  )
}

export const useOrderForm = () => useContext(OrderFormContext)
