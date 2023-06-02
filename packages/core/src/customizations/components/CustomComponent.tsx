import { ProductTitle as UIProductTitle } from '@faststore/ui'

export interface CustomComponentProps {
  name: string
}

export default function ProductTitle({ name = 'Component' }) {
  return <UIProductTitle title={<h1>Overriding {name}</h1>} />
}
