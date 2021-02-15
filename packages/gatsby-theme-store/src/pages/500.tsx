import { FormattedMessage, useLocalizedPath } from '@vtex/gatsby-plugin-i18n'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Box, Button, Flex } from '@vtex/store-ui'
import type { PageProps } from 'gatsby'

import Layout from '../components/Layout'
import Container from '../components/Container'
import { useSearchParams } from '../sdk/state/useSearchParams'

type Props = PageProps

const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

const Page: FC<Props> = () => {
  const [params] = useSearchParams()
  const path = useLocalizedPath('/')
  const [errorId, setErrorId] = useState('')

  useEffect(() => {
    setErrorId(params.get('errorId') ?? uuidv4())
  }, [errorId, params])

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
            <FormattedMessage id="error.title" />
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
            <FormattedMessage id="error.action" />
          </Box>

          <Button
            onClick={() => {
              window.location.href = path
            }}
          >
            <FormattedMessage id="error.action.button" />
          </Button>

          <Box
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
          </Box>
        </Flex>
      </Container>
    </Layout>
  )
}

export default Page
