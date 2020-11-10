/** @jsx jsx */
// The purpose of this file is to remove color mode support since it uses the
// HUGE thread blocking deepmerge. The original source is the following
// https://github.com/system-ui/theme-ui/blob/bfba2df8fdd01119c3af6a233355db1955c54ba0/packages/theme-provider/src/index.js#L1
import { FC } from 'react'
import { jsx, ThemeProvider as CoreProvider } from '@theme-ui/core'
import { Global } from '@emotion/core'
import { css } from '@theme-ui/css'

import theme from '../index'

const BodyStyles: FC = () => (
  <Global
    styles={(t: any) => {
      if (t.useBodyStyles === false || (t.styles && !t.styles.root))
        return false
      const boxSizing = t.useBorderBox === false ? null : 'border-box'

      return css({
        '*': {
          boxSizing,
        },
        body: {
          margin: 0,
          variant: 'styles.root',
        },
      })(t)
    }}
  />
)

export const ThemeProvider: FC = ({ children }) => (
  <CoreProvider theme={theme}>
    <BodyStyles />
    {children}
  </CoreProvider>
)
