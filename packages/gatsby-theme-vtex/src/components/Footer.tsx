/** @jsx jsx */
import { graphql, useStaticQuery } from 'gatsby'
import { FC } from 'react'
import { Flex, Grid, Image, jsx, Link, LocalizedLink } from '@vtex/store-ui'

import Container from './Container'
import { FooterQueryQuery } from './__generated__/FooterQuery.graphql'

interface Item {
  name: Maybe<string>
  slug: Maybe<string>
}

const MenuLink: FC<Item> = ({ slug, name }) => (
  <LocalizedLink to={`/${slug}`}>{name!.split(' ')[0]}</LocalizedLink>
)

const Footer: FC = () => {
  const { allDepartment } = useStaticQuery<FooterQueryQuery>(graphql`
    query FooterQuery {
      allDepartment(sort: { order: ASC, fields: name }) {
        nodes {
          name
          slug
        }
      }
    }
  `)

  return (
    <Container>
      <Flex variant="footer" as="footer" sx={{ flexDirection: 'column' }}>
        <Flex sx={{ flexDirection: ['column', 'row'] }}>
          <Grid gap={2} columns={[2, 4]} my={3} sx={{ flex: 1 }}>
            {allDepartment.nodes.map((item: Item) => (
              <MenuLink {...item} key={item.slug!} />
            ))}
          </Grid>
          <Flex>
            <Link
              href="https://www.facebook.com/vtexonline/"
              target="_blank"
              rel="noreferrer"
              sx={{
                height: '48px',
                width: '48px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                sx={{ height: 32, width: 32, mr: 1 }}
                height="32px"
                width="32px"
                loading="lazy"
                alt="Facebook"
                src="https://storecomponents.vtexassets.com/_v/public/assets/v1/published/vtex.store-footer@2.20.1/public/react/ebd4bd10e66138168eb6a582e00790ea.svg"
              />
            </Link>
            <Link
              href="https://www.instagram.com/vtextruecloud/"
              target="_blank"
              rel="noreferrer"
              sx={{
                height: '48px',
                width: '48px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                sx={{ height: 32, width: 32, mr: 1 }}
                height="32px"
                width="32px"
                loading="lazy"
                alt="Instagram"
                src="https://storecomponents.vtexassets.com/_v/public/assets/v1/published/vtex.store-footer@2.20.1/public/react/6a61a302319c062aceb9562a66381a63.svg"
              />
            </Link>
            <Link
              href="https://twitter.com/vtexonline"
              target="_blank"
              rel="noreferrer"
              sx={{
                height: '48px',
                width: '48px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                sx={{ height: 32, width: 32, mr: 1 }}
                height="32px"
                width="32px"
                loading="lazy"
                alt="Twitter"
                src="https://storecomponents.vtexassets.com/_v/public/assets/v1/published/vtex.store-footer@2.20.1/public/react/5f12d2a63f43d3a243550ff6400b4870.svg"
              />
            </Link>
            <Link
              href="https://www.youtube.com/user/VTEXTV"
              target="_blank"
              rel="noreferrer"
              sx={{
                height: '48px',
                width: '48px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                sx={{ height: 32, width: 32 }}
                height="32px"
                width="32px"
                loading="lazy"
                alt="Youtube"
                src="https://storecomponents.vtexassets.com/_v/public/assets/v1/published/vtex.store-footer@2.20.1/public/react/20a214b4866fd6d42a6dfed070c0057b.svg"
              />
            </Link>
          </Flex>
        </Flex>
        <Flex>
          <Image
            sx={{ height: 32, width: 32 }}
            height="32px"
            width="32px"
            loading="lazy"
            alt="Mastercard"
            src="https://storecomponents.vtexassets.com/_v/public/assets/v1/published/vtex.store-footer@2.20.1/public/react/a8a977f569877c2df3a46c5a7b0d4dec.svg"
          />
          <Image
            sx={{ height: 32, width: 32, mx: 1 }}
            height="32px"
            width="32px"
            loading="lazy"
            alt="Visa"
            src="https://storecomponents.vtexassets.com/_v/public/assets/v1/published/vtex.store-footer@2.20.1/public/react/69f24958103909c9e64057b9956d886f.svg"
          />
          <Image
            sx={{ height: 32, width: 32 }}
            height="32px"
            width="32px"
            loading="lazy"
            alt="Credit Card"
            src="https://storecomponents.vtexassets.com/_v/public/assets/v1/published/vtex.store-footer@2.20.1/public/react/d48ef71514c2996f778851c1df9cc5d0.svg"
          />
        </Flex>
        <Flex my={3}>
          All stock and product photos are from photos.icons8.com
        </Flex>
      </Flex>
    </Container>
  )
}

export default Footer
