import React, { FC } from 'react'
import { Flex, Box } from '@vtex/store-ui'

import { slugify } from './utils/slugify'
import { FormattedPrice } from '../FormattedPrice/FormattedPrice'

interface Props {
  label: string
  name?: string
  large: boolean
  value: number | null
}

export const SummaryItem: FC<Props> = ({ label, name, large, value }) => {
  const itemId = slugify(label)

  return (
    <Flex
      sx={{
        width: '100%',
        color: 'text',
        lineHeight: 'copy',
        alignItems: 'center',
        marginTop: large ? '.5rem' : '.75rem',
        paddingBottom: large ? '1rem' : undefined,
        fontSize: large ? 3 : 2,
      }}
    >
      <Box
        id={itemId}
        sx={{
          flex: 'none',
          fontWeight: 600,
          '@media screen and (min-width: 64em)': {
            fontWeight: 500,
          },
        }}
      >
        {name || label}
      </Box>
      <Box
        id={`${itemId}-price`}
        sx={{
          flex: '1 1 auto',
          textAlign: 'right',
          ...(large
            ? {
                fontWeight: 600,
                '@media screen and (min-width: 64em)': {
                  fontWeight: 500,
                },
              }
            : null),
        }}
      >
        <FormattedPrice value={value ? value / 100 : value} />
      </Box>
    </Flex>
  )
}
