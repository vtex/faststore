import React from 'react'
import MuiCard, { CardProps } from '@material-ui/core/Card'

export default function Card(props: CardProps) {
  return <MuiCard {...props} elevation={props.elevation ?? 0} />
}
