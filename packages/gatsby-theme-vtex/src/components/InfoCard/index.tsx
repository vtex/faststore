import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core'
import type { Theme } from '@material-ui/core'

import Typography from '../material-ui-components/Typography'
import Link from '../material-ui-components/Link'

interface Props {
  to: string
  headline?: string
  subhead?: string
  imgSrc: string
  imgAlt: string
  variant?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    backgroundColor: 'rgb(224, 239, 224)',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  headline: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '30%',
    },
  },
  subhead: {
    margin: theme.spacing(2),
  },
  imageBox: {
    display: 'inline',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
  },
}))

const InfoCard: FC<Props> = ({
  headline,
  subhead,
  children,
  to,
  imgSrc,
  imgAlt,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.headline}>
        {headline && (
          <Typography variant="h5" component="h2">
            {headline}
          </Typography>
        )}
        {subhead && <div className={classes.subhead}>{subhead}</div>}
        {children}
      </div>
      <div className={classes.imageBox}>
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
      </div>
    </div>
  )
}

export default InfoCard
