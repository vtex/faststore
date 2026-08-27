import { UIProvider } from '@faststore/ui'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeAll, describe, expect, it } from 'vitest'

import { RenderSectionsBase } from 'src/components/cms/RenderSections'
import { getDefaultMyAccountSections } from 'src/server/cms/myAccountDefaultSections'

/**
 * First-paint behavior of the My Account pages.
 *
 * Sections rendered through `RenderSectionsBase` go through `ViewportObserver`,
 * which emits an 823px-tall placeholder instead of the section content until the
 * element intersects the viewport. That is correct for the public storefront and
 * wrong for My Account, which is authenticated, SSR and above the fold.
 *
 * `skipLazyLoading` opts a whole render pass out of it.
 */

/** Never-firing observer — reproduces the pre-intersection (first paint) state. */
class NeverIntersectingObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = [] as unknown as ReadonlyArray<number>
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

beforeAll(() => {
  window.IntersectionObserver =
    NeverIntersectingObserver as unknown as typeof IntersectionObserver
})

const orderDetailsSections = getDefaultMyAccountSections(
  'myAccountOrderDetails'
).filter((section) => section.$componentKey !== 'AccountNavigation')

const markerComponents = Object.fromEntries(
  orderDetailsSections.map((section) => [
    section.$componentKey,
    () => <div>{section.$componentKey}</div>,
  ])
)

describe('skipLazyLoading', () => {
  it('renders section content immediately instead of a placeholder', () => {
    const { container } = render(
      <UIProvider>
        <RenderSectionsBase
          skipLazyLoading
          sections={[{ name: 'AccountOrderStatus', data: {} }]}
          components={{ AccountOrderStatus: () => <div>status</div> }}
        />
      </UIProvider>
    )

    expect(screen.getByText('status')).toBeTruthy()
    expect(container.querySelector('[data-store-section-name]')).toBeNull()
  })

  it('renders every default order-details section on first paint', () => {
    const { container } = render(
      <UIProvider>
        <RenderSectionsBase
          skipLazyLoading
          sections={orderDetailsSections}
          components={markerComponents}
        />
      </UIProvider>
    )

    for (const section of orderDetailsSections) {
      expect(screen.getByText(section.$componentKey)).toBeTruthy()
    }

    expect(
      container.querySelectorAll('[data-store-section-name]')
    ).toHaveLength(0)
  })

  it('covers store-authored sections, not only the framework defaults', () => {
    render(
      <UIProvider>
        <RenderSectionsBase
          skipLazyLoading
          sections={[{ name: 'StoreCustomAccountSection', data: {} }]}
          components={{
            StoreCustomAccountSection: () => <div>custom</div>,
          }}
        />
      </UIProvider>
    )

    expect(screen.getByText('custom')).toBeTruthy()
  })

  it('puts the section content in the SSR HTML, not the placeholder', () => {
    const html = renderToString(
      <UIProvider>
        <RenderSectionsBase
          skipLazyLoading
          sections={orderDetailsSections}
          components={markerComponents}
        />
      </UIProvider>
    )

    expect(html).toContain('AccountOrderStatus')
    expect(html).not.toContain('data-store-section-name')
    expect(html).not.toContain('823')
  })

  it('preserves lazy loading when the flag is absent', () => {
    const { container } = render(
      <UIProvider>
        <RenderSectionsBase
          sections={[{ name: 'AccountOrderStatus', data: {} }]}
          components={{ AccountOrderStatus: () => <div>status</div> }}
        />
      </UIProvider>
    )

    expect(screen.queryByText('status')).toBeNull()

    const placeholder = container.querySelector(
      '[data-store-section-name="AccountOrderStatus"]'
    ) as HTMLElement | null

    expect(placeholder?.style.height).toBe('823px')
  })
})
