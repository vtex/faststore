import { Box, Grid, Skeleton, Container, SuspenseDevice } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import {
  SearchTemplateAside,
  SearchTemplateContainer,
  SearchTemplateMain,
} from '../Search/SearchTemplate'

const array = new Array(10).fill(true)

const AboveTheFoldPreview: FC = () => (
  <Container>
    <Box sx={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
      <Skeleton width="500px" height="45px" />
    </Box>

    <SearchTemplateContainer>
      <SearchTemplateAside>
        <SuspenseDevice device="desktop" fallback={null}>
          <Skeleton width="230px" height="1000px" />
        </SuspenseDevice>
      </SearchTemplateAside>

      <SearchTemplateMain>
        <Box sx={{ my: '32px' }}>
          <Skeleton height="33px" />
        </Box>

        <Grid my={4} gap={3} columns={[2, 2, 3, 5]}>
          {array.map((_, id) => (
            <Skeleton key={`${id}.preview`} height="470px" />
          ))}
        </Grid>
      </SearchTemplateMain>
    </SearchTemplateContainer>
  </Container>
)

export default AboveTheFoldPreview
