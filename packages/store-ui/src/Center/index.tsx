/** @jsx jsx */
import { FC } from 'react'
import { Flex, jsx } from 'theme-ui'

export const Center: FC = ({ children }) => (
  <Flex
    sx={{
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    }}
  >
    {children}
  </Flex>
)
