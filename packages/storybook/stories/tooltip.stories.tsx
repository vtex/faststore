import { Tooltip } from '@faststore/ui'
import React from 'react'

export default {
  title: 'Tooltip',
}

export function BottomStart() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="bottom-start"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function BottomCenter() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="bottom-center"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function BottomEnd() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="bottom-end"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function TopStart() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="top-start"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function TopCenter() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="top-center"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function TopEnd() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="top-end"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function RightStart() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="right-start"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function RightCenter() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="right-center"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}

export function RightEnd() {
  return (
    <div
      style={{ margin: '16px', position: 'relative', display: 'inline-block' }}
    >
      <Tooltip
        content={<div>Tooltip content goes here</div>}
        placement="right-end"
      >
        <button>Hover over me</button>
      </Tooltip>
    </div>
  )
}
