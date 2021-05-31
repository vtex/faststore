import { render } from '@testing-library/react'
import React, { useRef } from 'react'

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
})
