import type { SxStyleProp } from 'theme-ui'

import { createTheme } from '../../createTheme'
import { accordionTheme } from './accordion'

export const searchFilterTheme: SxStyleProp = createTheme(accordionTheme)
