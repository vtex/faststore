import { createTheme } from '../../createTheme'
import { menuTheme } from './menu'
import { minicartTheme } from './minicart'
import { notificationbarTheme } from './notificationbar'
import { overmenuTheme } from './overmenu'
import { searchTheme } from './search'

export const headerTheme = {
  header: createTheme(
    {
      bg: 'muted',
      px: [0, 2, 4],
      py: 3,
      justifyContent: ['center', 'space-between', 'space-between'],
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    overmenuTheme,
    menuTheme,
    notificationbarTheme,
    searchTheme,
    minicartTheme,
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

export default headerTheme
