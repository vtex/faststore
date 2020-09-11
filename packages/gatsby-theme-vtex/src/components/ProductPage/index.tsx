/** @jsx jsx */
import { Breadcrumb, Card, Flex, Grid, Heading, jsx } from '@vtex/store-ui'
import { graphql } from 'gatsby'
import { FC, lazy } from 'react'

import BuyButton from '../BuyButton'
import Container from '../Container'
import OfferPreview from '../Offer/Preview'
import ProductDetailsImage from '../ProductDetailsImage'
import ProductSpecification from '../ProductSpecification'
import SEO from '../SEO/ProductDetails'
import SuspenseSSR from '../Suspense/SSR'
import { ProductDetailsTemplate_ProductFragment } from './__generated__/ProductDetailsTemplate_product.graphql'

const AsyncOffer = lazy(() => import('../Offer/Async'))

interface Props {
  product: ProductDetailsTemplate_ProductFragment
}

const getSpecifications = (values: Record<string, string[]>) =>
  Object.keys(values).reduce((acc: any[], item: string) => {
    acc = [...acc, { title: item, value: values[item][0] }]

    return acc
  }, [])

const ProductDetailsTemplate: FC<Props> = ({ product }) => {
  const {
    categoryTree: breadcrumb = [],
    productName,
    linkText,
    items,
  } = product as any

  const [{ images }] = items
  const [{ imageUrl, imageText }] = images

  return (
    <Flex variant="productPage.container">
      <Container>
        <SEO title={productName} slug={linkText} />
        <Breadcrumb breadcrumb={breadcrumb} type="PRODUCT" />
        <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
          <ProductDetailsImage
            src={imageUrl}
            alt={imageText}
            loading="eager" // Never lazy load image in product details
          />
          <Card>
            <Heading variant="productTitle" as="h1">
              {productName}
            </Heading>
            <SuspenseSSR fallback={<OfferPreview variant="detail" />}>
              <AsyncOffer slug={linkText} variant="detail" />
            </SuspenseSSR>
            <BuyButton sku={items[0] as any} />
          </Card>
        </Grid>
        <ProductSpecification
          values={getSpecifications({
            Cor: ['Preto'],
            Acabamento: ['Fosco'],
            'Tipo de Assento': ['Fixo'],
            'Linha ou Coleção': ['Sofia'],
            Comprimento: ['45,5 cm'],
            Largura: ['53 cm'],
            Altura: ['82,5 cm'],
            Material: ['Polipropileno'],
            'Altura do chão até o assento': ['45,5 cm'],
            'Suporta até (kg)': ['182 kg'],
            Empilhável: ['Sim'],
            Braço: ['Não'],
            Antiderrapante: ['Sim'],
            'Necessita Montagem': ['Não'],
            'Cômodo Indicado': ['Cozinhas'],
            Peso: ['3,60 kg'],
            Certificado: [
              'Produto certificado de acordo com a Portaria do Inmetro nº 342/2014',
            ],
            'Garantia do fabricante': [
              '12 meses para vícios ou defeitos de fabricação',
            ],
            'Aviso sobre o produto': ['Imagem meramente ilustrativa'],
          })}
        />
      </Container>
    </Flex>
  )
}

export const query = graphql`
  fragment ProductDetailsTemplate_product on VTEX_Product {
    # allSpecificationsGroups
    productName
    linkText
    items {
      images {
        imageUrl
        imageText
      }
      sellers {
        sellerId
        commertialOffer {
          AvailableQuantity
          Price
        }
      }
    }
  }
`

export default ProductDetailsTemplate
