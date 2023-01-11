import React, { useState } from 'react'
import { Rating, RatingProps, Star } from '@faststore/ui'

export type RatingActionableProps = {
  value: RatingProps['value']
}

const RatingActionable = (props: RatingActionableProps) => {
  const [rating, setRating] = useState(props.value)

  return <Rating value={rating} icon={<Star />} onChange={setRating} />
}

export default RatingActionable
