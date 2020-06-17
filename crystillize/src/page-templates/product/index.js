/* eslint react/no-multi-comp: 0 */
import React, { useState } from "react"
import Img from "@crystallize/react-image"
import isEqual from "lodash/isEqual"
import { graphql } from "gatsby"

import { H1, H2, Button, screen, Outer } from "ui"
import CategoryItem from "components/category-item"
import { CurrencyValue } from "components/currency-value"
import VariantSelector from "components/variant-selector"
import ShapeComponents from "components/shape-components"
import { attributesToObject } from "utils/variants"

import Layout from "components/layout"

import {
  Sections,
  Media,
  MediaInner,
  Info,
  Price,
  ProductFooter,
  Summary,
  Description,
  RelatedTopics,
  TopicMap,
  TopicTitle,
  List,
} from "./styles"

const ProductPage = ({ product, defaultVariant }) => {
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant)

  const onAttributeChange = (attributes, newAttribute) => {
    const newAttributes = attributesToObject(attributes)
    newAttributes[newAttribute.attribute] = newAttribute.value

    const newSelectedVariant = product.variants.find(variant => {
      const variantAttributes = attributesToObject(variant.attributes)
      return isEqual(variantAttributes, newAttributes)
    })

    setSelectedVariant(newSelectedVariant)
  }

  const onVariantChange = variant => setSelectedVariant(variant)

  const buy = async () => {
    console.log("todo: buy")
  }

  const summaryComponent = product.components.find(c => c.name === "Summary")
  const description = product.components.find(c => c.name === "Description")
  const { topics } = product

  const selectedVariantImg = (selectedVariant.image || {}).url
  const placeHolderImg = "/images/placeholder-image.png"

  return (
    <Outer>
      <Sections>
        <Media>
          <MediaInner>
            <Img
              src={selectedVariantImg || placeHolderImg}
              onError={e => {
                e.target.onerror = null
                e.target.src = placeHolderImg
              }}
              sizes={`(max-width: ${screen.sm}px) 400px, 600px`}
              alt={product.name}
            />
          </MediaInner>
        </Media>
        <Info>
          <H1>{product.name}</H1>
          <Summary>
            {summaryComponent && (
              <ShapeComponents components={[summaryComponent]} />
            )}
          </Summary>

          {product.variants.length > 1 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantChange={onVariantChange}
              onAttributeChange={onAttributeChange}
            />
          )}

          <ProductFooter>
            <Price>
              <strong>
                <CurrencyValue value={selectedVariant.price} />
              </strong>
            </Price>
            <Button onClick={buy}>Add to Basket</Button>
          </ProductFooter>
        </Info>
      </Sections>

      <Description>
        <ShapeComponents className="description" components={[description]} />
      </Description>

      {topics && topics.length && (
        <RelatedTopics>
          <H2>Related</H2>

          {topics.map(topic => {
            // We only want to show the first 4 products for a topic
            const cells = topic.items.edges
              .filter(({ node }) => node.id !== product.id)
              .slice(0, 4)
              .map(({ node }) => ({
                item: { ...node },
              }))

            if (!cells.length) {
              return null
            }

            return (
              <TopicMap>
                <TopicTitle>{topic.name}</TopicTitle>
                <List>
                  {cells.map(cell => (
                    <CategoryItem data={cell.item} key={cell.id} />
                  ))}
                </List>
              </TopicMap>
            )
          })}
        </RelatedTopics>
      )}
    </Outer>
  )
}

const ProductPageDataLoader = ({ data: { crystallize } }) => {
  const { product } = crystallize
  const headerItems = crystallize.headerItems?.children
  const defaultVariant = product.variants?.find(v => v.isDefault)

  if (!defaultVariant) {
    return (
      <Layout headerItems={headerItems}>This product has no variants</Layout>
    )
  }

  return (
    <Layout headerItems={headerItems} title={product.name}>
      <ProductPage
        key={product.id}
        product={product}
        defaultVariant={defaultVariant}
      />
    </Layout>
  )
}

export const query = graphql`
  query getProduct($path: String!) {
    crystallize {
      headerItems: catalogue(language: "en", path: "/") {
        children {
          name
          path
        }
      }

      product: catalogue(language: "en", path: $path) {
        ...crystallize_item
        ...crystallize_product

        topics {
          id
          items(first: 4) {
            ... on CRYSTALLIZE_TopicItemConnection {
              edges {
                node {
                  ...crystallize_item
                  ...crystallize_product
                }
              }
            }
          }
        }
      }
    }
  }
`

export default ProductPageDataLoader
