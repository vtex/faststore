import type { ComponentPropsWithoutRef, FC } from 'react'
import React from 'react'
import { Box } from 'theme-ui'

import Toast from '../../Toast'

type Props = ComponentPropsWithoutRef<typeof Toast>

const MinicartDrawerToast: FC<Props> = (props) => (
  <Box variant="minicart.drawer.toast">
    <Toast {...props} />
  </Box>
)

export default MinicartDrawerToast
