import classNames from 'classnames'
import React, { forwardRef } from 'react'

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  onValueChange?: (value: string) => void
  className?: string
  icon?: React.ReactNode
  error?: boolean
}

type Ref = HTMLInputElement

export const Input = forwardRef<Ref, InputProps>(
  ({ className, icon, error, onValueChange = () => {}, ...props }, ref) => {
    const IconWrapper = () =>
      icon ? (
        <span className="m-3 flex w-5 items-center justify-center">{icon}</span>
      ) : null

    return (
      <div
        className={classNames(
          'border-neutral-light-gray bg-neutral-white focus-within:border-neutral-dark-gray flex w-full justify-between rounded border',
          { 'border-feedback-red focus-within:border-feedback-red': error }
        )}
      >
        <input
          type="text"
          ref={ref}
          aria-invalid={error}
          className={classNames(
            'lg:text-15 bg-neutral-white disabled:text-neutral-dark-gray text-17 h-8 w-full rounded pl-3 focus:outline-none disabled:opacity-50 ',
            className
          )}
          onChange={(e) => onValueChange(e.target.value)}
          {...props}
        />
        <IconWrapper />
      </div>
    )
  }
)

Input.displayName = 'Input'
