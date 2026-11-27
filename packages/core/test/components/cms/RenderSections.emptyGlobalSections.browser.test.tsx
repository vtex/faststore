import { UIProvider } from '@faststore/ui'
import { render } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import RenderSections, {
  EMPTY_SECTIONS_WARNING,
} from 'src/components/cms/RenderSections'

vi.mock('next/router', () => ({
  useRouter: () => ({ isPreview: false }),
}))

vi.mock('src/sdk/performance/useTTI', () => ({
  default: () => ({ isInteractive: false }),
}))

class NoopIntersectionObserver implements IntersectionObserver {
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
    NoopIntersectionObserver as unknown as typeof IntersectionObserver
})

afterEach(() => {
  vi.restoreAllMocks()
})

/**
 * Reproduces the crash seen on My Account pages when Next.js serves the
 * `{}` response of a middleware-skipped prefetch (`x-middleware-prefetch: 1`
 * -> `x-middleware-skip: 1`): the `globalSections` prop is absent and
 * `<RenderSections globalSections={undefined}>` renders with no `sections`.
 *
 * With nothing to render, the component still outputs the Toast placeholder
 * (the viewport observer container of the always-present Toast section).
 */
describe('RenderSections without globalSections and sections', () => {
  const renderWithoutSections = (props: Parameters<typeof RenderSections>[0]) =>
    render(
      <UIProvider>
        <RenderSections components={{}} {...props} />
      </UIProvider>
    )

  it.each([
    ['undefined', undefined],
    ['null', null],
  ])('renders the Toast placeholder when globalSections is %s', (_, value) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { container } = renderWithoutSections({ globalSections: value })

    expect(
      container.querySelector('[data-store-section-name="Toast"]')
    ).not.toBeNull()
  })

  it('renders the Toast placeholder when sections is null', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { container } = renderWithoutSections({ sections: null })

    expect(
      container.querySelector('[data-store-section-name="Toast"]')
    ).not.toBeNull()
  })

  it('warns once with the stable empty page props message', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    renderWithoutSections({ globalSections: undefined })

    const emptyPropsWarnings = warn.mock.calls.filter(
      ([message]) => message === EMPTY_SECTIONS_WARNING
    )

    expect(emptyPropsWarnings).toHaveLength(1)
    expect(EMPTY_SECTIONS_WARNING).toContain('[faststore:empty-page-props]')
  })

  it('does not warn when globalSections are provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    renderWithoutSections({ globalSections: [] })

    expect(warn).not.toHaveBeenCalledWith(EMPTY_SECTIONS_WARNING)
  })
})
