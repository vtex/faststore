import { Link } from 'gatsby'
import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import { Typography } from '@material-ui/core'

interface Props {
  to: string
  headline?: string
  subhead?: string
  imgSrc: string
  imgAlt: string
  variant?: string
}

const InfoCard: FC<Props> = ({
  headline,
  subhead,
  children,
  to,
  imgSrc,
  imgAlt,
}) => {
  return (
    <Box
      display="flex"
      bgcolor="rgb(224, 239, 224)"
      alignItems="center"
      justifyContent="center"
      flexDirection={['column', 'row']}
    >
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        width={['100%', '30%']}
      >
        {headline && (
          <Typography variant="h5" component="h2">
            {headline}
          </Typography>
        )}
        {subhead && <Box m={2}>{subhead}</Box>}
        {children}
      </Box>
      <Box width={['100%', '70%']} display="inline">
        <Link to={to}>
          <img
            style={{
              maxHeight: '540px',
              width: '100%',
            }}
            alt={imgAlt}
            src={imgSrc}
            loading="lazy"
          />
        </Link>
      </Box>
    </Box>
  )
}

export default InfoCard
