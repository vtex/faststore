import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'

import Carousel from './Carousel'

const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount))

const SLIDING_TRANSITION_DURATION = 100

describe('Carousel component', () => {
  it('should have `data-store-carousel` attribute in the section tag', () => {
    const { getByTestId } = render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')

    expect(carouselSection).toHaveAttribute('data-store-carousel')
  })

  it('should have `data-carousel-track-container` and `data-carousel-track` attributes', () => {
    const { getByTestId } = render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')

    const trackContainer = carouselSection.querySelectorAll(
      '[data-carousel-track-container]'
    )

    const track = carouselSection.querySelectorAll('[data-carousel-track]')

    expect(trackContainer).toHaveLength(1)
    expect(trackContainer[0]).toBeInTheDocument()

    expect(track).toHaveLength(1)
    expect(track[0]).toBeInTheDocument()
  })

  it('should have `data-carousel-controls` and `data-carousel-bullets` attributes', () => {
    const { getByTestId } = render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')

    const controls = carouselSection.querySelectorAll(
      '[data-carousel-controls]'
    )

    const bulletsContainer = carouselSection.querySelectorAll(
      '[data-carousel-bullets]'
    )

    expect(controls).toHaveLength(1)
    expect(controls[0]).toBeInTheDocument()

    expect(bulletsContainer).toHaveLength(1)
    expect(bulletsContainer[0]).toBeInTheDocument()
  })

  it('should render 5 slides with `data-carousel-item` attributes', () => {
    const { getByTestId } = render(
      <Carousel infiniteMode={false}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')
    const items = carouselSection.querySelectorAll('[data-carousel-item]')

    expect(items).toHaveLength(5)
  })

  it('should add `data-visible` attribute to currently visible carousel items', () => {
    const { getByTestId } = render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')

    const items = carouselSection.querySelectorAll('[data-carousel-item]')

    expect(items).toHaveLength(7)

    // Only the first item should have `data-visible` attributes
    expect(items[0]).not.toHaveAttribute('data-visible')
    expect(items[1]).toHaveAttribute('data-visible')
    expect(items[2]).not.toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')
    expect(items[5]).not.toHaveAttribute('data-visible')
    expect(items[6]).not.toHaveAttribute('data-visible')
  })

  it('should allow users to navigate through pages using the `Arrows` controls', async () => {
    const { getByTestId, getByLabelText } = render(
      <Carousel
        transition={{
          property: 'transform',
          duration: SLIDING_TRANSITION_DURATION,
        }}
        infiniteMode={false}
      >
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')
    const goToNextPageButton = getByLabelText('next')
    const goToPreviousPageButton = getByLabelText('previous')
    const carouselTrack = carouselSection.querySelector('[data-carousel-track]')

    expect(goToNextPageButton).toBeInTheDocument()
    expect(goToPreviousPageButton).toBeInTheDocument()

    // Go from page 0 to 1
    act(() => {
      fireEvent.click(goToNextPageButton)
    })

    let items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the second item should be visible
    expect(items[0]).not.toHaveAttribute('data-visible')
    expect(items[1]).toHaveAttribute('data-visible')
    expect(items[2]).not.toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')

    // Go from page 1 back to 0
    await act(async () => {
      /**
       * These two lines simulate what happens after a user navigates:
       *
       * 1. Wait for the animation triggered by the `goToNextPageButton` click
       *    to finish.
       * 2. `onTransitionEnd` event is triggered.
       * 3. User is then able to click the `goToPreviousPageButton` button.
       *
       * react-testing-library (or dom-testing-library) doesn't trigger the
       * `onTransitionEnd` event, so we need to do it manually.
       */
      await wait(SLIDING_TRANSITION_DURATION)
      carouselTrack && fireEvent.transitionEnd(carouselTrack)

      fireEvent.click(goToPreviousPageButton)
    })

    items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the first item should be visible
    expect(items[0]).toHaveAttribute('data-visible')
    expect(items[1]).not.toHaveAttribute('data-visible')
    expect(items[2]).not.toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')
  })

  it('should allow users to navigate through pages by clicking on a pagination bullet', async () => {
    const { getByTestId, queryAllByTestId, getByLabelText } = render(
      <Carousel
        transition={{
          property: 'transform',
          duration: SLIDING_TRANSITION_DURATION,
        }}
        infiniteMode={false}
      >
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')
    const bullets = queryAllByTestId('store-bullets-item')
    const carouselTrack = carouselSection.querySelector('[data-carousel-track]')

    expect(bullets).toHaveLength(5)

    const secondPageBullet = getByLabelText('Go to page 2')

    act(() => {
      fireEvent.click(secondPageBullet)
    })

    let items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the second item should be visible
    expect(items[0]).not.toHaveAttribute('data-visible')
    expect(items[1]).toHaveAttribute('data-visible')
    expect(items[2]).not.toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')

    const thirdPageBullet = getByLabelText('Go to page 3')

    await act(async () => {
      /**
       * These two lines simulate what happens after a user navigates.
       *
       * 1. Wait for the animation triggered by the `secondPageBullet` click
       *    to finish.
       * 2. `onTransitionEnd` event is triggered.
       * 3. User is then able to click the `thirdPageBullet` button.
       *
       * react-testing-library (or dom-testing-library) doesn't trigger the
       * `onTransitionEnd` event, so we need to do it manually.
       */
      await wait(SLIDING_TRANSITION_DURATION)
      carouselTrack && fireEvent.transitionEnd(carouselTrack)

      fireEvent.click(thirdPageBullet)
    })

    items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the 3rd item should be visible
    expect(items[0]).not.toHaveAttribute('data-visible')
    expect(items[1]).not.toHaveAttribute('data-visible')
    expect(items[2]).toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')
  })
})
