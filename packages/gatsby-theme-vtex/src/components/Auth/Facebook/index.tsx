import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

interface Props {
  variant: string
}

const FacebookOAuth: FC<Props> = ({ variant: v }) => {
  return (
    <Box variant={`login.${v}.emailVerification`} as="button">
      Under Construction
    </Box>
  )
}

export default FacebookOAuth
