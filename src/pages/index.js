import React from "react"
import { graphql } from "gatsby"
import Grid from "@crystallize/grid-renderer/react"
import styled from "styled-components"

import Layout from "components/layout"
import Product from "components/category-item"

import { H1, Outer, Header } from "ui"

const StyledGrid = styled(Grid)`
  grid-gap: 1rem;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

export default function IndexPage({ data }) {
  const {
    crystallize: {
      grid,
      headerItems: { children: headerItems },
    },
  } = data

  return (
    <Layout title="Home" headerItems={headerItems}>
      <Outer>
        <Header>
          <H1>Oh hi there!</H1>
          <p>Cool of you to join us.</p>
        </Header>

        {grid && (
          <StyledGrid
            model={grid}
            cellComponent={({ cell }) => <Product data={cell.item} />}
          />
        )}
      </Outer>
    </Layout>
  )
}

export const query = graphql`
  query getIndex {
    crystallize {
      headerItems: catalogue(language: "en", path: "/") {
        children {
          name
          path
        }
      }
      grid(id: "5dc3fe4d43b90109229ee27b") {
        id
        name
        rows {
          columns {
            layout {
              rowspan
              colspan
            }
            itemType
            itemId
            item {
              ...crystallize_item
              ...crystallize_product
            }
          }
        }
      }
    }
  }
`
