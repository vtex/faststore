/**
 * This is a thin wrapper around react helmet that defers or not the head tags creation based on the execution evironment
 *
 * If the execution environment is a Google/Facebook Bot, the tags are included ASAP so the Bots don't miss any tag
 * else the tags are lazy loaded so we don't spend time creating useless tags for a human, thus loading the page faster
 */
import React from 'react'
import { Helmet as ReactHelmet } from 'react-helmet-async'
import type { ComponentPropsWithoutRef, FC } from 'react'

import { isBot } from '../../utils/env'

type Props = Omit<
  ComponentPropsWithoutRef<typeof ReactHelmet>,
  'defer' | 'async'
>

const Helmet: FC<Props> = (props) => {
  const defer = !isBot

  return <ReactHelmet defer={defer} async={defer} {...props} />
}

export default Helmet
