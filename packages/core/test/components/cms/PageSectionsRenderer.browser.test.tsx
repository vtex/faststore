import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import PageSectionsRenderer from 'src/components/cms/PageSectionsRenderer'

describe('PageSectionsRenderer', () => {
  it('delegates the original sections without adding markup', () => {
    const sections = [{ name: 'Primary', data: {} }]
    const renderSections = vi.fn(() => <main data-testid="sections" />)
    const { container } = render(
      <PageSectionsRenderer
        contentType="customPage"
        sections={sections}
        settings={{ layout: 'default' }}
        renderSections={renderSections}
      />
    )

    expect(renderSections).toHaveBeenCalledOnce()
    expect(renderSections).toHaveBeenCalledWith(sections)
    expect(container.firstElementChild).toBe(screen.getByTestId('sections'))
  })
})
