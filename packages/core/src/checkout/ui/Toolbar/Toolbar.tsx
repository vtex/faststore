import React from 'react'
import type { ReactNode } from 'react'

const LoginIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 10C12.7625 10 15 7.7625 15 5C15 2.2375 12.7625 0 10 0C7.2375 0 5 2.2375 5 5C5 7.7625 7.2375 10 10 10ZM10 12.5C6.6625 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3375 12.5 10 12.5Z"
      fill="currentcolor"
    />
  </svg>
)

const GoBackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 8.71098H4.7875L11.775 1.75464L10 0L0 9.95541L10 19.9108L11.7625 18.1562L4.7875 11.1998H20V8.71098Z"
      fill="currentcolor"
    />
  </svg>
)

interface LinkProps {
  children: ReactNode
  className?: string
  href: string
}

const Link: React.FC<LinkProps> = ({ children, className, href }) => (
  <a href={href} className={className}>
    {children}
  </a>
)

interface ToolbarProps {
  Logo: ReactNode
}

export function Toolbar({ Logo }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <GoBackIcon />
          <span className="sr-only">Back to shopping</span>
        </Link>
        <Link href="/" className="pl-5">
          {Logo}
          <span className="sr-only">Back to the store</span>
        </Link>
      </div>

      <Link href="/">
        <LoginIcon />
        <span className="sr-only">Login</span>
      </Link>
    </div>
  )
}
