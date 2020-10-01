import React, { FC } from 'react'

type Props = { shipping: any }
const ShippingTable: FC<Props> = ({ shipping }) => {
  return <div>{JSON.stringify(shipping, null, 2)}</div>
}

export default ShippingTable
