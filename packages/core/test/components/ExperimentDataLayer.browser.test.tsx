import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import ExperimentDataLayer, {
  EXPERIMENT_ID,
  pushExperimentContext,
} from '../../src/components/ExperimentDataLayer'

afterEach(() => {
  // Reset cookies and dataLayer between tests
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim()
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }
  }
  window.dataLayer = []
})

describe('pushExperimentContext', () => {
  it('pushes experiment context when the variant cookie is present', () => {
    const dataLayer: Array<Record<string, unknown>> = []

    pushExperimentContext('vtex_exp_variant=treatment', dataLayer)

    expect(dataLayer).toEqual([
      { experiment_id: EXPERIMENT_ID, variant_id: 'treatment' },
    ])
  })

  it('does not push anything when the variant cookie is absent', () => {
    const dataLayer: Array<Record<string, unknown>> = []

    pushExperimentContext('some_other_cookie=1', dataLayer)

    expect(dataLayer).toEqual([])
  })
})

describe('<ExperimentDataLayer />', () => {
  it('pushes variant_id from the cookie plus the hardcoded experiment_id', () => {
    window.dataLayer = []
    document.cookie = 'vtex_exp_variant=treatment; path=/'

    render(<ExperimentDataLayer />)

    expect(window.dataLayer).toContainEqual({
      experiment_id: EXPERIMENT_ID,
      variant_id: 'treatment',
    })
  })

  it('does not push to dataLayer when the cookie is absent', () => {
    window.dataLayer = []

    render(<ExperimentDataLayer />)

    expect(window.dataLayer).toEqual([])
  })
})
