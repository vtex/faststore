import { Button, Icon } from '@faststore/ui'
import React from 'react'

export default {
  title: 'Button',
}

export function Default() {
  return <Button>Click</Button>
}

export function Primary() {
  return <Button variant="primary">Primary action</Button>
}

export function WithIcon() {
  return (
    <Button
      variant="primary"
      iconPosition="left"
      icon={<Icon name="House" width={20} height={20} />}
    >
      Primary w/ icon
    </Button>
  )
}
