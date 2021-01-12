import { FormattedMessage, useLocalizedPath } from '@vtex/gatsby-plugin-i18n'
import React, { useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'
import { Box, Button, Flex } from '@vtex/store-ui'

import Layout from '../Layout'
import Container from '../Container'

type Props = {
  error: any
  errorId: string
}

const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

const Error: FC<Props> = ({ error, errorId = uuidv4() }) => {
  const path = useLocalizedPath('/')

  useEffect(() => console.error(error))

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

export default Error
