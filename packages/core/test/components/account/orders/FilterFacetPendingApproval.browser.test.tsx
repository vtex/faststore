/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import FilterFacetPendingApproval from '../../../../src/components/account/orders/ListOrders/FilterSlider/FilterFacetPendingApproval'

describe('FilterFacetPendingApproval', () => {
  it('uses the localized label for visible and accessible text', () => {
    render(
      <FilterFacetPendingApproval
        label="Aguardando minha aprovação"
        selected={[]}
        dispatch={vi.fn()}
      />
    )

    expect(screen.getByText('Aguardando minha aprovação')).toBeTruthy()
    expect(
      screen.getByRole('switch', { name: 'Aguardando minha aprovação' })
    ).toBeTruthy()
  })
})
