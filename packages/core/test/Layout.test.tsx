/**
 * @vitest-environment jsdom
 */

import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const usePageViewEvent = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/analytics/hooks/usePageViewEvent', () => ({
  usePageViewEvent,
}))

const useStartRecommendationSession = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/analytics/hooks/useStartRecommendationSession', () => ({
  useStartRecommendationSession,
}))

import Layout from 'src/Layout'

beforeEach(() => {
  usePageViewEvent.mockClear()
  useStartRecommendationSession.mockClear()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Layout recommendation session', () => {
  it('calls useStartRecommendationSession without page props (feature-flag gated in the hook)', async () => {
    render(
      <Layout>
        <div data-testid="child" />
      </Layout>
    )

    await waitFor(() => {
      expect(useStartRecommendationSession).toHaveBeenCalledTimes(1)
      expect(useStartRecommendationSession).toHaveBeenCalledWith()
    })
  })

  it('does not pass CMS/page props into useStartRecommendationSession', async () => {
    const Child = (props: { sections?: unknown[] }) => (
      <div data-testid="page">{JSON.stringify(props.sections)}</div>
    )

    render(
      <Layout>
        <Child
          sections={[
            {
              name: 'RecommendationShelf',
              data: {
                campaignVrn: 'vrn:recommendations:acc:rec-top-items-v2:x',
              },
            },
          ]}
        />
      </Layout>
    )

    await waitFor(() => {
      expect(useStartRecommendationSession).toHaveBeenCalledWith()
      expect(useStartRecommendationSession.mock.calls[0]).toHaveLength(0)
    })
  })
})
