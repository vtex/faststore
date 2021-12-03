import '@testing-library/jest-dom/extend-expect'
import { toHaveNoViolations } from 'jest-axe'

import { toHaveNoIncompletes } from './utils/toHaveNoIncomplete'

expect.extend(toHaveNoViolations)
expect.extend(toHaveNoIncompletes)
