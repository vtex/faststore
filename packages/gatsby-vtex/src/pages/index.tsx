import { RouteComponentProps } from '@reach/router'
import { graphql, Link, useStaticQuery } from 'gatsby'
import React, { FC } from 'react'
import { Box, Grid, Heading, Styled } from 'theme-ui'

import Layout from '../components/Layout'
import SEO from '../components/Seo'
import { scaleImage } from '../utils/img'

const p1: any = {
  id: '2000034',
  productName: 'Different Seller',
  categoriesIds: ['/25/47/48/', '/25/47/', '/25/'],
  slug: '/asduashduas/p',
  items: [
    {
      images: [
        {
          imageUrl:
            'https://storecomponents.vteximg.com.br/arquivos/ids/155553/download.png?v=637027012534770000',
        },
      ],
    },
  ],
}

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
        {[...allProduct.nodes, p1].map((product: any) => (
          <Link
            key={product.id}
            to={product.slug}
            sx={{
              textDecoration: 'none',
              color: 'text',
            }}
          >
            <Box>
              <Styled.img
                height="300px"
                src={scaleImage(
                  product.items[0].images[0].imageUrl,
                  'auto',
                  300
                )}
              />
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
