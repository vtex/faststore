import { type CardProps, Card as UICard } from '@faststore/ui'

function Card({ children, ...props }: CardProps) {
  return (
    <UICard {...props} data-fs-my-account-card>
      {children}
    </UICard>
  )
}

export default Card
