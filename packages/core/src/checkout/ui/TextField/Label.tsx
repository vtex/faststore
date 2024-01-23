import classNames from 'classnames'
import React from 'react'

export interface LabelProps
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {
  className?: string
  children?: React.ReactNode
}

export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <label
      className={classNames(
        'lg:text-15 text-17 text-neutral-dark-gray font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
