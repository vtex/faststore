// import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
import React from 'react'
import type { FC } from 'react'
import { Box, Button, Flex } from '@vtex/store-ui'
import type { PageProps } from 'gatsby'

import Layout from '../components/Layout'
import Container from '../components/Container'

type Props = PageProps

const Page: FC<Props> = () => {
  return (
    <Layout>
      <Container>
        <Flex p={2} sx={{ alignItems: 'center', flexDirection: 'column' }}>
          <Box
            as="h3"
            sx={{
              fontSize: '43px',
              fontWeight: '600',
              textAlign: 'center',
              color: 'primary',
              mt: '50px',
            }}
          >
            You are offline
          </Box>
          <Box
            as="p"
            sx={{
              paddingX: '15px',
              fontSize: '20px',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            You can try reloading the page
          </Box>

          <Button
            onClick={() => {
              window.location.reload()
            }}
          >
            ⤾ Reload
          </Button>

          {/* <Box
            as="p"
            sx={{
              paddingX: '15px',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '20px',
              color: '#656565',
            }}
          >
            <FormattedMessage id="error.detail" values={{ errorId }} />
          </Box> */}
        </Flex>
      </Container>
    </Layout>
  )
}

export default Page
