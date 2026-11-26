import { UIProvider } from '@faststore/ui'
import { render } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import RenderSections from 'src/components/cms/RenderSections'

vi.mock('next/router', () => ({
  useRouter: () => ({ isPreview: false }),
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

/**
 * Reproduces the crash seen on My Account pages when Next.js serves the
 * `{}` response of a middleware-skipped prefetch (`x-middleware-prefetch: 1`
 * -> `x-middleware-skip: 1`): `globalSections` prop is absent, so the page does
 * `const { sections: globalSections } = globalSectionsProp ?? {}` and renders
 * `<RenderSections globalSections={undefined}>` with no `sections` either.
 */
describe('RenderSections without globalSections and sections', () => {
  it('does not throw when both globalSections and sections are undefined', () => {
    const globalSectionsProp: { sections?: never } | undefined = undefined
    const { sections: globalSections } = globalSectionsProp ?? {}

    expect(() =>
      render(
        <UIProvider>
          <RenderSections globalSections={globalSections} components={{}} />
        </UIProvider>
      )
    ).not.toThrow()
  })
})
