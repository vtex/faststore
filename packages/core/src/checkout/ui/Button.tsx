import classNames from 'classnames'
import { PropsWithChildren } from 'react'

type Size = 'sm' | 'md'

export type ButtonProps = PropsWithChildren<{
  className?: string
  onClick?: () => void
  size?: Size
  text?: boolean
  disabled?: boolean
}>

export const Button = ({
  children,
  disabled,
  text = false,
  size = 'md',
  className = '',
  onClick = () => {},
}: ButtonProps) => {
  const sizeStyles = {
    sm: 'px-2 py-1',
    md: 'px-4 py-2',
  }[size]
  const bgStyles = text
    ? 'bg-transparent text-brand-primary'
    : 'bg-brand-primary text-white active:bg-brand-secondary active:text-brand-primary'
  return (
    <button
      disabled={disabled}
      className={classNames(
        className,
        sizeStyles,
        bgStyles,
        'disabled:opacity-70 rounded border-2 border-none font-semibold'
      )}
      onClick={() => onClick()}
    >
      {children}
    </button>
  )
}
