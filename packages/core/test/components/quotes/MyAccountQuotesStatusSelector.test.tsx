/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import MyAccountQuotesStatusSelector from '../../../src/components/account/quotes/MyAccountListQuotes/MyAccountQuotesStatusSelector/MyAccountQuotesStatusSelector'

describe('MyAccountQuotesStatusSelector', () => {
  it('renders a chip with the mapped label for each selected value', () => {
    render(
      <MyAccountQuotesStatusSelector value={['Draft']} onChange={vi.fn()} />
    )

    expect(screen.getByText('Draft')).toBeTruthy()
  })

  it('opens the dropdown when the trigger is clicked', () => {
    const { container } = render(
      <MyAccountQuotesStatusSelector value={[]} onChange={vi.fn()} />
    )

    expect(screen.queryByLabelText('Approved')).toBeNull()

    fireEvent.click(
      container.querySelector('[aria-controls="status-listbox"]')!
    )

    expect(screen.getByLabelText('Approved')).toBeTruthy()
  })

  it('calls onChange with the key added when a checkbox is checked', () => {
    const onChange = vi.fn()
    const { container } = render(
      <MyAccountQuotesStatusSelector value={[]} onChange={onChange} />
    )

    fireEvent.click(
      container.querySelector('[aria-controls="status-listbox"]')!
    )
    fireEvent.click(screen.getByLabelText('Draft'))

    expect(onChange).toHaveBeenCalledWith(['Draft'])
  })

  it('calls onChange with the key removed when an already-selected checkbox is unchecked', () => {
    const onChange = vi.fn()
    const { container } = render(
      <MyAccountQuotesStatusSelector value={['Draft']} onChange={onChange} />
    )

    fireEvent.click(
      container.querySelector('[aria-controls="status-listbox"]')!
    )
    fireEvent.click(screen.getByLabelText('Draft'))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('calls onChange with the key removed when a chip remove button is clicked', () => {
    const onChange = vi.fn()
    render(
      <MyAccountQuotesStatusSelector
        value={['Draft', 'Approved']}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByLabelText('Remove Draft'))

    expect(onChange).toHaveBeenCalledWith(['Approved'])
  })

  it('falls back to the raw key for a chip with no matching status entry', () => {
    render(
      <MyAccountQuotesStatusSelector
        value={['NotAStatus']}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByText('NotAStatus')).toBeTruthy()
  })

  it('renders the default "Status" label when no override is given', () => {
    render(<MyAccountQuotesStatusSelector value={[]} onChange={vi.fn()} />)

    expect(screen.getByText('Status')).toBeTruthy()
  })

  it('honors a CMS-provided field label', () => {
    render(
      <MyAccountQuotesStatusSelector
        value={[]}
        onChange={vi.fn()}
        statusLabel="Estado"
      />
    )

    expect(screen.getByText('Estado')).toBeTruthy()
    expect(screen.queryByText('Status')).toBeNull()
  })

  it('honors CMS-provided status option labels for chips and the dropdown', () => {
    const { container } = render(
      <MyAccountQuotesStatusSelector
        value={['Draft']}
        onChange={vi.fn()}
        statusCmsLabels={{ draftStatus: 'Rascunho' }}
      />
    )

    expect(screen.getByText('Rascunho')).toBeTruthy()

    fireEvent.click(
      container.querySelector('[aria-controls="status-listbox"]')!
    )

    expect(screen.getByLabelText('Rascunho')).toBeTruthy()
  })
})
