import type { ProductCardProps } from '.'
import Icon from '../../ui/Icon'
import Button from '../../ui/Button'
import ProductCard from '.'

const story = {
  component: ProductCard,
  title: 'Molecules/ProductCard ⚠️',
  argTypes: {
    variant: {
      defaultValue: 'default',
      table: { defaultValue: 'default' },
    },
    product: { table: { disable: true } },
    index: { table: { disable: true } },
    aspectRatio: {
      defaultValue: 1,
      description: 'ProductCard Image aspect ratio',
      options: [0.75, 1.5, 1],
      control: { type: 'radio' },
      table: { defaultValue: '1' },
    },
    ButtonBuy: {
      control: 'boolean',
      table: { defaultValue: false },
    },
  },
}

const product = {
  id: '15503951',
  slug: 'handmade-steel-towels-practical-15503951',
  sku: '15503951',
  brand: { brandName: 'Brand', name: 'Brand' },
  name: 'red',
  gtin: '5595633577807',
  isVariantOf: {
    productGroupID: '130742',
    name: 'Handmade Steel Towels Practical',
  },
  image: [
    {
      url: 'http://storeframework.vtexassets.com/arquivos/ids/190191/numquam.jpg?v=637755599170100000',
      alternateName: 'est',
    },
  ],
  offers: {
    lowPrice: 181.71,
    offers: [
      {
        availability: 'https://schema.org/InStock',
        price: 181.71,
        listPrice: 208.72,
        quantity: 1,
        seller: { identifier: '1' },
      },
    ],
  },
}

const Template = ({ ButtonBuy, ...args }: ProductCardProps) => {
  const button = ButtonBuy ? (
    <Button
      variant="primary"
      data-fs-button-size="small"
      icon={<Icon name="ShoppingCart" width={18} height={18} />}
      iconPosition="left"
    >
      Add
    </Button>
  ) : null

  return (
    <div style={{ width: 300 }}>
      <ProductCard ButtonBuy={button} {...args} />
    </div>
  )
}

const TemplateWide = ({ ButtonBuy, ...args }: ProductCardProps) => {
  const button = ButtonBuy ? (
    <Button
      variant="primary"
      data-fs-button-size="small"
      icon={<Icon name="ShoppingCart" width={18} height={18} />}
      iconPosition="left"
    >
      Add
    </Button>
  ) : null

  return (
    <div style={{ width: 400 }}>
      <ProductCard ButtonBuy={button} {...args} />
    </div>
  )
}

export const Default = Template.bind({})
export const Wide = TemplateWide.bind({})

Default.args = {
  product,
  index: 1,
  variant: 'default',
  bordered: false,
  aspectRatio: 1,
  ButtonBuy: false,
}

Wide.args = {
  product,
  index: 1,
  variant: 'wide',
  bordered: false,
  aspectRatio: 1.5,
  ButtonBuy: false,
}

export default story
