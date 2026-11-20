import { UIProvider } from '@faststore/ui'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import type { PageSectionsRendererProps } from 'src/components/cms/PageSectionsRenderer'
import RenderSections, {
  RenderSectionsBase,
} from 'src/components/cms/RenderSections'
import { getDefaultMyAccountSections } from 'src/server/cms/myAccountDefaultSections'

vi.mock('next/dynamic', () => ({ default: () => () => null }))
vi.mock('next/router', () => ({
  useRouter: () => ({ isPreview: false }),
}))
vi.mock('src/sdk/performance/useTTI', () => ({
  default: () => ({ isInteractive: true }),
}))
vi.mock('src/server/content/utils', () => ({
  isContentPlatformSource: () => false,
}))
vi.mock('src/components/cms/global/Components', () => ({ default: {} }))
vi.mock('src/customizations/src/components/PageSectionsRenderer', () => ({
  default: ({
    contentType,
    sections,
    settings,
    renderSections,
  }: PageSectionsRendererProps) => (
    <div
      data-testid="page-sections-renderer"
      data-content-type={contentType}
      data-layout={String(settings?.layout)}
    >
      {renderSections(sections)}
    </div>
  ),
}))

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

describe('PageSectionsRenderer customization', () => {
  it('receives generic page context and delegates augmented sections', () => {
    render(
      <UIProvider>
        <RenderSections
          contentType="customPage"
          globalSections={[]}
          sections={[{ name: 'Primary', data: {} }]}
          settings={{ layout: 'sidebar' }}
          components={{
            Primary: () => <div>primary</div>,
            RegionSlider: () => <div>region slider</div>,
          }}
        />
      </UIProvider>
    )

    const renderer = screen.getByTestId('page-sections-renderer')

    expect(renderer.getAttribute('data-content-type')).toBe('customPage')
    expect(renderer.getAttribute('data-layout')).toBe('sidebar')
    expect(screen.getByText('primary')).toBeTruthy()
    expect(screen.getByText('region slider')).toBeTruthy()
  })
})
