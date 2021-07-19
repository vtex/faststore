import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'

import Carousel from './Carousel'

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

    expect(items).toHaveLength(5)
  })

  it('should add `data-visible` attribute to currently visible carousel items', () => {
    const { getByTestId } = render(
      <Carousel itemsPerPage={2}>
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

    // Only the first and second items should have `data-visible` attributes
    expect(items[0]).toHaveAttribute('data-visible')
    expect(items[1]).toHaveAttribute('data-visible')
    expect(items[2]).not.toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')
  })

  it('should allow users to navigate through pages using the `Arrows` controls', () => {
    const { getByTestId, getByLabelText } = render(
      <Carousel itemsPerPage={2}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Carousel>
    )

    const goToNextPageButton = getByLabelText('next')
    const goToPreviousPageButton = getByLabelText('previous')

    expect(goToNextPageButton).toBeInTheDocument()
    expect(goToPreviousPageButton).toBeInTheDocument()

    // Go from page 0 to 1
    act(() => {
      fireEvent.click(goToNextPageButton)
    })

    const carouselSection = getByTestId('store-carousel')
    let items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the items in the second page should be visible
    expect(items[0]).not.toHaveAttribute('data-visible')
    expect(items[1]).not.toHaveAttribute('data-visible')
    expect(items[2]).toHaveAttribute('data-visible')
    expect(items[3]).toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')

    // Go from page 1 back to 0
    act(() => {
      fireEvent.click(goToPreviousPageButton)
    })

    items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the items in the first page should be visible
    expect(items[0]).toHaveAttribute('data-visible')
    expect(items[1]).toHaveAttribute('data-visible')
    expect(items[2]).not.toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')
  })

  it('should allow users to navigate through pages by clicking on a pagination bullet', () => {
    const { getByTestId, queryAllByTestId, getByLabelText } = render(
      <Carousel itemsPerPage={2}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </Carousel>
    )

    const carouselSection = getByTestId('store-carousel')
    const bullets = queryAllByTestId('store-bullets-item')

    expect(bullets).toHaveLength(3)

    const secondPageBullet = getByLabelText('Go to page 2')

    act(() => {
      fireEvent.click(secondPageBullet)
    })

    let items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the items in the second page should be visible
    expect(items[0]).not.toHaveAttribute('data-visible')
    expect(items[1]).not.toHaveAttribute('data-visible')
    expect(items[2]).toHaveAttribute('data-visible')
    expect(items[3]).toHaveAttribute('data-visible')
    expect(items[4]).not.toHaveAttribute('data-visible')

    const thirdPageBullet = getByLabelText('Go to page 3')

    act(() => {
      fireEvent.click(thirdPageBullet)
    })

    items = carouselSection.querySelectorAll('[data-carousel-item]')

    // Only the items in the last page (3rd) should be visible
    expect(items[0]).not.toHaveAttribute('data-visible')
    expect(items[1]).not.toHaveAttribute('data-visible')
    expect(items[2]).not.toHaveAttribute('data-visible')
    expect(items[3]).not.toHaveAttribute('data-visible')
    expect(items[4]).toHaveAttribute('data-visible')
  })
})
