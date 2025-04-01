import React from 'react'
import { type CardProps, Card as UICard } from '@faststore/ui'

interface MyAccountCardProps extends CardProps {}

function MyAccountCard({ children, ...props }: MyAccountCardProps) {
  return (
    <UICard {...props} data-fs-my-account-card>
      {children}
    </UICard>
  )
}

export default MyAccountCard
