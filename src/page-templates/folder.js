import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"

import { Outer, Header, H1, responsive } from "ui"
import Layout from "components/layout"
import Product from "components/category-item"
import ShapeComponents from "components/shape-components"

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  grid-auto-rows: 300px;

  ${responsive.sm} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${responsive.md} {
    grid-template-columns: repeat(4, 1fr);
  }

  ${responsive.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`

export default function FolderPage({ data }) {
  const {
    crystallize: {
      folder,
      headerItems: { children: headerItems },
    },
  } = data

  const { children } = folder

  return (
    <Layout title={folder.name} headerItems={headerItems}>
      <Outer>
        <Header centerContent={!children}>
          <H1>{folder.name}</H1>
          <ShapeComponents components={folder.components} />
        </Header>
        {children && (
          <List>
            {children.map(child => (
              <Product data={child} key={child.id} />
            ))}
          </List>
        )}
      </Outer>
    </Layout>
  )
}

export const query = graphql`
  query getFolder($path: String!) {
    crystallize {
      headerItems: catalogue(language: "en", path: "/") {
        children {
          name
          path
        }
      }

      folder: catalogue(language: "en", path: $path) {
        ...crystallize_item

        children {
          ...crystallize_item
          ...crystallize_product
        }
      }
    }
  }
`
