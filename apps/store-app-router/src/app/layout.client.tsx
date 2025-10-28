'use client'
import type { ReactNode } from 'react'
import './theme'

export function ClientLayout(props: LayoutProps) {
  const { children } = props
  return <>{children}</>
}

interface LayoutProps {
  children: ReactNode
}
