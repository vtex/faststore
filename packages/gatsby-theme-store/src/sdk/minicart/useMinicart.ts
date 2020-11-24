import { useContext } from 'react'

import { MinicartState } from '.'

export const useMinicart = () => useContext(MinicartState)
