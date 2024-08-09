import type { HTMLAttributes } from "react";
import React, { forwardRef } from 'react'

import { Icon } from '../..'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    /**
    * Specfies the text to be loaded into the header.
    */
    title?: string
    /**
    * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
    */
    testId?: string
    /**
    * Specifies the card max width, if not informed it will be of 300px.
    */
    maxWidth?: string
    /**
    * Specifies what icon to use following the FastStore Icon sheet.
    */
    iconName?: string
    /**
    * Specifies the icon's color
    */
    iconColor?: string
    /**
    * Function that should be executed when the icon is clicked
    */
    iconAction?: () => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card({
    title,
    children,
    maxWidth,
    testId = 'fs-card',
    iconName,
    iconColor,
    iconAction
}, ref) {
    return (
        <div data-testid={testId} ref={ref} data-fs-card style={{ maxWidth: `${maxWidth}` }}>
            <div data-fs-card-header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div data-fs-card-title>{title}</div>
                {iconName && (
                    <Icon name={iconName} width={20} height={20} weight="bold" color={iconColor} onClick={iconAction} />
                )}
            </div>
            <div data-fs-card-body>
                {children}
            </div>
        </div >


    )
})

export default Card


