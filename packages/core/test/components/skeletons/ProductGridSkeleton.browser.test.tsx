/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('src/components/skeletons/ProductCardSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="product-card-skeleton" />,
}))

import ProductGridSkeleton from '../../../src/components/skeletons/ProductGridSkeleton/ProductGridSkeleton'

describe('ProductGridSkeleton', () => {
  it('renders the requested number of placeholder cards', () => {
    render(<ProductGridSkeleton loading count={4} />)

    expect(screen.getAllByTestId('product-card-skeleton')).toHaveLength(4)
  })

  it('renders children when not loading', () => {
    render(
      <ProductGridSkeleton loading={false}>
        <div data-testid="grid-content">products</div>
      </ProductGridSkeleton>
    )

    expect(screen.getByTestId('grid-content')).toBeTruthy()
    expect(screen.queryByTestId('product-card-skeleton')).toBeNull()
  })
})
