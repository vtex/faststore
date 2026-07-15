/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const useStartRecommendationSession = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/analytics/hooks/useStartRecommendationSession', () => ({
  useStartRecommendationSession,
}))

import StartRecommendationSession from 'src/components/sections/StartRecommendationSession'

describe('StartRecommendationSession', () => {
  it('starts the recommendation session and renders nothing', () => {
    const { container } = render(<StartRecommendationSession />)

    expect(useStartRecommendationSession).toHaveBeenCalledTimes(1)
    expect(container).toBeEmptyDOMElement()
  })

  it('exposes the CMS component key', () => {
    expect(StartRecommendationSession.$componentKey).toBe(
      'StartRecommendationSession'
    )
  })
})
