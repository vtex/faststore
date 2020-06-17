import React from "react"
import styled from "styled-components"
import { graphql } from "gatsby"

import { Outer, H1, Header } from "ui"
import Layout from "components/layout"
import ShapeComponents from "components/shape-components"

const Document = styled(Header)`
  max-width: 700px;
  margin: 0 auto;
  padding: 0 50px;
  img {
    width: calc(100% + 300px);
    margin-left: -150px;
    max-height: 400px;
    max-width: 4000px;
    object-fit: contain;
    position: relative;
    height: auto;
  }
  h1 {
    padding-top: 50px;
  }
  ul {
    font-size: 18px;
    margin: 8px 0 10px 20px;
    li {
      padding: 4px 0;
    }
  }
`

const DocumentPage = ({ data }) => {
  const {
    crystallize: {
      article,
      headerItems: { children: headerItems },
    },
  } = data

  return (
    <Layout title={article.name} headerItems={headerItems}>
      <Outer>
        <Document>
          <ShapeComponents
            components={article.components}
            overrides={{
              Title: H1,
            }}
          />
        </Document>
      </Outer>
    </Layout>
  )
}

export default DocumentPage

export const query = graphql`
  query getArticle($path: String!) {
    crystallize {
      headerItems: catalogue(language: "en", path: "/") {
        children {
          name
          path
        }
      }

      article: catalogue(language: "en", path: $path) {
        id
        name

        components {
          name
          type
          meta {
            key
            value
          }
          content {
            ...crystallize_singleLineContent
            ...crystallize_richTextContent
            ...crystallize_imageContent
            ...crystallize_paragraphCollectionContent
          }
        }
      }
    }
  }
`
