import { useMemo } from 'react'

const controller = () => import('./controller')

const fullTextSearch = (term: string) =>
  controller().then((ctl) => ctl.search(term))

export const useFullTextSearch = () => useMemo(() => fullTextSearch, [])
