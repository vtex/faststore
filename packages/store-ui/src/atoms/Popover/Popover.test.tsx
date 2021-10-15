import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React, { useRef } from 'react'
import { act } from 'react-dom/test-utils'

import Popover from './Popover'

const PopoverTemplate = (props: any) => {
  const ref = useRef<any>(null)

  return (
    <>
      <div ref={ref} />
      <Popover {...props} targetRef={ref}>
        <div>
          <p>Whoa! Look at me!</p>
        </div>
      </Popover>
    </>
  )
}

describe('Popover', () => {
  it('`data-store-popover` is present', () => {
    const { getByTestId } = render(<PopoverTemplate />)

    expect(getByTestId('store-popover')).toHaveAttribute('data-store-popover')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<PopoverTemplate />)

      await act(async () => {
        expect(await axe(getByTestId('store-popover'))).toHaveNoViolations()
      })
    })
  })
})
