import type { Story } from '@storybook/react'
import type { FC } from 'react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { AggregateRatingProps, RatingItemProps } from '../AggregateRating'
import Component from '../AggregateRating'
import mdx from './AggregateRating.mdx'

const RatingIcon: FC<RatingItemProps> = (props) => {
  const fillColor = {
    empty: 'transparent',
    half: 'url(#half)',
    full: '#ffb100',
  }

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="#ffb100" />
          <stop offset="50%" stopColor="transparent" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,
             31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,
             12.118l11.547-1.2L16.026,0.6L20.388,10.918z"
        fill={fillColor[props['data-store-aggregate-rating-item']!]}
        strokeWidth="2"
        stroke="#ffb100"
      />
    </svg>
  )
}

const AggregateRatingTemplate: Story<AggregateRatingProps> = ({
  value,
  testId,
}) => {
  return (
    <Component value={value} testId={testId}>
      <RatingIcon />
      <RatingIcon />
      <RatingIcon />
      <RatingIcon />
      <RatingIcon />
    </Component>
  )
}

export const AggregateRating = AggregateRatingTemplate.bind({})
AggregateRating.args = { value: 3 }

const AggregateRatingWithoutIconTemplate: Story<AggregateRatingProps> = ({
  value,
  testId,
}) => {
  return (
    <Component value={value} testId={testId}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isFullRating = value - index >= 1

        console.log(isFullRating ? '★' : '☆')

        return isFullRating ? '★' : '☆'
      })}
    </Component>
  )
}

export const AggregateRatingWithoutIcon = AggregateRatingWithoutIconTemplate.bind(
  {}
)
AggregateRatingWithoutIcon.args = { value: 3 }

const AggregateRatingWithCSSTemplate: Story<AggregateRatingProps> = ({
  value,
  testId,
}) => {
  return (
    <Component data-with-css value={value} testId={testId}>
      <span />
      <span />
      <span />
      <span />
      <span />
    </Component>
  )
}

export const AggregateRatingWithCSS = AggregateRatingWithCSSTemplate.bind({})
AggregateRatingWithCSS.args = { value: 2 }

const argTypes: ComponentArgTypes<AggregateRatingProps> = {
  value: {
    control: { type: 'number' },
  },
}

export default {
  title: 'Molecules/AggregateRating',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
