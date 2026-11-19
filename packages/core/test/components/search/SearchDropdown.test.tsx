/**
 * @vitest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const { received, capture } = vi.hoisted(() => {
  const received: Record<string, Record<string, unknown>> = {}
  const capture =
    (name: string) =>
    ({
      children,
      ...props
    }: Readonly<{ children?: unknown } & Record<string, unknown>>) => {
      received[name] = props
      return (children ?? null) as never
    }
  return { received, capture }
})

vi.mock('@faststore/ui', () => ({
  SearchDropdown: capture('SearchDropdown'),
  SearchAutoComplete: capture('SearchAutoComplete'),
  SearchAutoCompleteTerm: capture('SearchAutoCompleteTerm'),
  SearchProducts: capture('SearchProducts'),
  useSearch: () => ({
    values: { products: [], term: '', terms: [], searchId: undefined },
  }),
}))

vi.mock('src/components/search/SearchHistory', () => ({
  SearchHistory: capture('SearchHistory'),
}))

vi.mock('src/components/search/SearchTop', () => ({
  SearchTop: capture('SearchTop'),
}))

vi.mock('src/components/search/SearchProductItem', () => ({
  default: () => null,
}))

vi.mock('src/sdk/search/formatSearchPath', () => ({
  useFormatSearchPath: () => (args: { term: string }) => `/s?q=${args.term}`,
}))

import SearchDropdown from '../../../src/components/search/SearchDropdown/SearchDropdown'

afterEach(() => {
  for (const key of Object.keys(received)) delete received[key]
})

describe('SearchDropdown labels', () => {
  it('forwards the CMS labels to each dropdown block', () => {
    render(
      <SearchDropdown
        sort="score_desc"
        loadingLabel="Carregando..."
        searchHistoryTitle="Histórico"
        searchHistoryClearLabel="Limpar histórico"
        searchTopTitle="Mais buscados"
        searchProductsTitle="Produtos sugeridos"
      />
    )

    expect(received.SearchDropdown).toMatchObject({
      loadingLabel: 'Carregando...',
    })
    expect(received.SearchHistory).toMatchObject({
      title: 'Histórico',
      clearLabel: 'Limpar histórico',
    })
    expect(received.SearchTop).toMatchObject({ title: 'Mais buscados' })
    expect(received.SearchProducts).toMatchObject({
      title: 'Produtos sugeridos',
    })
  })
})
