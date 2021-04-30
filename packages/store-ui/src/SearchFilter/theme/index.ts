import type { ThemeUIStyleObject } from 'theme-ui'

import { createTheme } from '../../createTheme'
import { accordionTheme } from './accordion'

export const searchFilterTheme: ThemeUIStyleObject = createTheme(accordionTheme)
