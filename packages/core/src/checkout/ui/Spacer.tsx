import React from 'react'
import classNames from 'classnames'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

/* An experiment of using the following pattern, we may drop this in the future
 * if we deem it's not worth it or if it causes problems:
 * https://www.joshwcomeau.com/react/modern-spacer-gif/
 * The idea is to let the components themselves be agnostic wrt spacing, and let
 * the parent component that is dealing with layout take care of it.
 * This should allow for more flexible components, for better separation of
 * concerns, and for slightly simpler components */

export const Spacer: React.FC<Props> = ({ size = 'sm' }) => (
  <span
    className={classNames('block', {
      'h-4 lg:h-5': !size || size === 'sm',
      'h-6 lg:h-7': size === 'md',
      'h-8 lg:h-9': size === 'lg',
      // Should add more sizes as needed (xl, 2xl, ...)
    })}
  />
)
