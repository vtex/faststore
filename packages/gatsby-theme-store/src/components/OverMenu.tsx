import { Box, Flex, Link as LinkUI, LocalizedLink } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

const StoreHeaderOverMenu: FC<{ variant?: string }> = ({ variant }) => (
  <Box variant={variant}>
    <Flex>
      <LocalizedLink className="first" to="/">
        Shop
      </LocalizedLink>
      <LocalizedLink to="/about">About us</LocalizedLink>
    </Flex>
    <Flex>
      <LinkUI className="last" target="blank" href="https://vtex.com">
        visit vtex.com
      </LinkUI>
    </Flex>
  </Box>
)

export default StoreHeaderOverMenu
