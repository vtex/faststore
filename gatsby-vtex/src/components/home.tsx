/** @jsx jsx */
import { Grid, Box, Styled, jsx, Heading } from "theme-ui"
import { RouteComponentProps } from "@reach/router"
import { useStaticQuery, graphql, Link } from "gatsby"
import Layout from "./layout"
import SEO from "./seo"
import { FC } from "react"

const Home: FC<RouteComponentProps> = () => {
  const { allProduct } = useStaticQuery(graphql`
    {
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
  `)

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

export default Home
