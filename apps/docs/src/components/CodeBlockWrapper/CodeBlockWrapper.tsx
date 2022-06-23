import React from 'react'
import type { MouseEventHandler } from 'react'

interface CodeBlockWrapperState {
  isCodeBlockCollapsed: boolean
  isCollapsibleModeOn: boolean
}

interface CodeBlockWrapperProps {
  children: Node
  onToggleCodeBlock: MouseEventHandler<HTMLButtonElement>
  state: CodeBlockWrapperState
}

const CodeBlockWrapper = (props: CodeBlockWrapperProps) => {
  const { children, state } = props

  return (
    <div>
      {children}
      {state.isCodeBlockCollapsed && <div />}
    </div>
  )
}

export default CodeBlockWrapper
