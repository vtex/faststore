import { renderHook, act } from '@testing-library/react-hooks'

import useSlider from './useSlider'

describe('useSlider', () => {
  it('should initialize sliderState correctly', () => {
    const expectedSliderState = {
      currentSlide: 0,
      currentPage: 0,
      sliding: false,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    }

    const { result: returnValue } = renderHook(() =>
      useSlider({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const receivedSliderState = returnValue.current.sliderState

    expect(receivedSliderState).toEqual(expectedSliderState)
  })

  it('should go to next page and update state accordingly', () => {
    const { result } = renderHook(() =>
      useSlider({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const finalState = {
      currentSlide: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    }

    const { sliderDispatch } = result.current

    act(() => {
      sliderDispatch({ type: 'NEXT_PAGE' })
    })

    expect(result.current.sliderState).toEqual(finalState)
  })

  it('should go to previous page and update state accordingly', () => {
    const { result } = renderHook(() =>
      useSlider({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const { sliderDispatch } = result.current

    act(() => {
      sliderDispatch({ type: 'PREVIOUS_PAGE' })
    })

    expect(result.current.sliderState).toEqual({
      currentSlide: 4,
      currentPage: 2,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })

    act(() => {
      sliderDispatch({ type: 'PREVIOUS_PAGE' })
    })

    expect(result.current.sliderState).toEqual({
      currentSlide: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })
  })

  it('should go to a certain page and update state accordingly', () => {
    const { result } = renderHook(() =>
      useSlider({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const { sliderDispatch } = result.current

    act(() => {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 1,
        },
      })
    })

    expect(result.current.sliderState).toEqual({
      currentSlide: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })

    act(() => {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 2,
        },
      })
    })

    expect(result.current.sliderState).toEqual({
      currentSlide: 4,
      currentPage: 2,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })

    act(() => {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 0,
        },
      })
    })

    expect(result.current.sliderState).toEqual({
      currentSlide: 0,
      currentPage: 0,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })
  })
})
