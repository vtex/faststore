import { Card, Flex, Grid, Skeleton } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import Container from '../Container'

const AboveTheFoldPreview: FC = () => (
  <Container>
    <Flex variant="productPage.container">
      <Skeleton width="500px" height="45px" />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <Skeleton width="500px" height="500px" />
        <Card>
          <Skeleton width="500px" height="20px" />
          <Skeleton width="500px" height="20px" />
          <Skeleton width="500px" height="20px" />
          <Skeleton width="500px" height="20px" />
        </Card>
      </Grid>
    </Flex>
  </Container>
)

export default AboveTheFoldPreview
