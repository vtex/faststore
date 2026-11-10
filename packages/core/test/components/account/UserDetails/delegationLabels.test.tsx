/**
 * @vitest-environment jsdom
 */

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  defaultDelegationLabels,
  fillLabel,
  resolveDelegationLabels,
} from '../../../../src/components/account/UserDetails/delegation/delegationLabels'
import { renderLabel } from '../../../../src/components/account/UserDetails/delegation/delegationText'

describe('resolveDelegationLabels', () => {
  it('returns the defaults when nothing is provided', () => {
    expect(resolveDelegationLabels()).toEqual(defaultDelegationLabels)
  })

  it('overrides only the provided labels', () => {
    const resolved = resolveDelegationLabels({ addLabel: 'Invite' })

    expect(resolved.addLabel).toBe('Invite')
    expect(resolved.removeLabel).toBe(defaultDelegationLabels.removeLabel)
  })

  it('falls back to the default when a label is blank', () => {
    const resolved = resolveDelegationLabels({
      addLabel: '   ',
      removeLabel: '',
    })

    expect(resolved.addLabel).toBe(defaultDelegationLabels.addLabel)
    expect(resolved.removeLabel).toBe(defaultDelegationLabels.removeLabel)
  })

  it('ignores unknown props passed through from the CMS section', () => {
    const resolved = resolveDelegationLabels({
      $componentKey: 'AccountUserDetails',
    } as never)

    expect(Object.keys(resolved)).toEqual(Object.keys(defaultDelegationLabels))
  })
})

describe('fillLabel', () => {
  it('replaces every placeholder', () => {
    expect(fillLabel('{a} and {b}, then {a}', { a: 'one', b: 'two' })).toBe(
      'one and two, then one'
    )
  })

  it('keeps unknown placeholders visible', () => {
    expect(fillLabel('Hello {who}', { name: 'x' })).toBe('Hello {who}')
  })

  it('returns plain text untouched', () => {
    expect(fillLabel('No tokens here', { a: 'b' })).toBe('No tokens here')
  })
})

describe('renderLabel', () => {
  it('wraps only the listed tokens in <strong>', () => {
    const { container } = render(
      <p>
        {renderLabel(
          '{delegate} acts for {name}.',
          { delegate: 'Ana', name: 'Bo' },
          ['name']
        )}
      </p>
    )

    expect(container.textContent).toBe('Ana acts for Bo.')
    expect(
      Array.from(container.querySelectorAll('strong')).map(
        (node) => node.textContent
      )
    ).toEqual(['Bo'])
  })

  it('keeps unknown tokens as written', () => {
    const { container } = render(
      <p>{renderLabel('Hi {who}', { name: 'x' }, ['who'])}</p>
    )

    expect(container.textContent).toBe('Hi {who}')
    expect(container.querySelector('strong')).toBeNull()
  })
})
