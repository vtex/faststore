import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Grid, Flex, Box } from '@vtex/store-ui'

import Container from '../Container'
import SuspenseDevice from '../Suspense/Device'

const array = new Array(10).fill(true)

const Preview: FC = () => (
  <Container>
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Skeleton width="500px" height="61px" />

      <div
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <aside
          sx={{
            display: ['none', 'block'],
            flexGrow: 1,
            flexBasis: 'sidebar',
            width: 230,
          }}
        >
          {/* Desktop Filters */}
          <Box variant="searchFilter.desktop">
            <SuspenseDevice device="desktop" fallback={null}>
              <Skeleton width="230px" />
            </SuspenseDevice>
          </Box>
        </aside>

        <div
          sx={{
            flexGrow: 99999,
            flexBasis: 0,
            minWidth: 300,
            ml: [0, '3rem'],
          }}
        >
          {/* Controls */}
          {/* <Skeleton /> */}

          {/* Product List  */}
          <Grid my={4} gap={3} columns={[2, 2, 3, 5]}>
            {array.map((_, id) => (
              <Skeleton key={`${id}.preview`} height="470px" />
            ))}
          </Grid>
        </div>
      </div>
    </Flex>
  </Container>
)

export default Preview
