import { useIdleEffect } from '../../useIdleEffect'

interface HomeView {
  type: 'homeView'
  payload: any
}

interface ProductView {
  type: 'productView'
  payload: any
}

interface InternalSearchView {
  type: 'internalSearchView'
  payload: Partial<{
    siteSearchTerm: string // "areia"
    siteSearchForm: string // "/gatos/ambiente---gatos/caixa-de-areia-gato/areia?PS=20"
    siteSearchCategory: string // "1000283"
    siteSearchResults: number // 26
  }>
}

type ViewEvent = HomeView | ProductView | InternalSearchView

export const useRCSendEvent = ({ type, payload }: ViewEvent) => {
  useIdleEffect(() => {
    window.vtexrca('sendevent', type, payload)
  }, [type, payload])
}
