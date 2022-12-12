// This file is a workaround to docusaurus codegen

import React from 'react'
import UILink from '.'

export type LinkBaseProps = {
    /**
     * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
     */
    testId?: string
    /**
   * Specifies the component variant.
   */
    variant?: 'default' | 'display' | 'footer' | 'inline'
    /**
    * Defines use of inverted color.
    */
    inverse?: boolean
    /**
     * Defines size os element
     */
    size?: 'small' | 'regular'
  }

const Link = (props: LinkBaseProps) => (
    <UILink {...props}/> 
)

export default Link