import { Button } from '@vtex/faststore-ui'

export default {
  title: 'Button',
}

export function Default() {
  return <Button>Click</Button>
}

export function Primary() {
  return <Button variant="primary">Primary action</Button>
}
