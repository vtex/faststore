import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Grid, Flex, Card } from '@vtex/store-ui'

import Container from '../Container'

const AboveTheFoldPreview: FC = () => (
  <Container>
    <Flex variant="productPage.container">
      <Skeleton width="500px" height="45px" />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <Skeleton width={500} height={500} />
        <Card>
          <Skeleton width={500} height={20} />
          <Skeleton width={500} height={20} />
          <Skeleton width={500} height={20} />
          <Skeleton width={500} height={20} />
        </Card>
      </Grid>
    </Flex>
  </Container>
)

export default AboveTheFoldPreview
