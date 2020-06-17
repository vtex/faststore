/** @jsx jsx */
import { Link, graphql } from "gatsby"
import { Grid, Box, Styled, jsx, Heading } from "theme-ui"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default function IndexPage({ data: { allProduct } }) {
  return (
    <Layout>
      <SEO />
      <Grid mt={4} gap={3} columns={[2, null, 4]}>
        {allProduct.nodes.map(product => (
          <Link
            key={product.id}
            to={product.slug}
            sx={{
              textDecoration: "none",
              color: "text",
            }}
          >
            <Box>
              <Styled.img src={product.items[0].images[0].imageUrl} />
              <Heading variant="shellProductName" as="h3">
                {product.productName}
              </Heading>
            </Box>
          </Link>
        ))}
      </Grid>
    </Layout>
  )
}

export const query = graphql`
  query {
    allProduct {
      nodes {
        id
        productName
        slug
        items {
          images {
            imageUrl
          }
        }
      }
    }
  }
`
