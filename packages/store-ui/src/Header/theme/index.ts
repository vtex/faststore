import { SxStyleProp } from 'theme-ui'

import { createTheme } from '../../createTheme'
import { menuTheme } from './menu'
import { notificationbarTheme } from './notificationbar'
import { overmenuTheme } from './overmenu'
import { searchTheme } from './search'

export const headerTheme: SxStyleProp = {
  header: createTheme(
    {
      bg: 'muted',
      px: [1, 2, 3],
      py: 3,
      justifyContent: ['center', 'space-between', 'space-between'],
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    overmenuTheme,
    menuTheme,
    notificationbarTheme,
    searchTheme,
    {
      left: {
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
      },
      right: {
        alignItems: 'center',
      },
    }
  ),
}
