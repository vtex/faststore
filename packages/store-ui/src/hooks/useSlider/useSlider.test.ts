import { renderHook, act } from '@testing-library/react-hooks'

import useSlider from './useSlider'

describe('useSlider', () => {
  it('should initialize sliderState correctly', () => {
    const expectedSliderState = {
      currentItem: 0,
      currentPage: 0,
      sliding: false,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
      infinite: false,
    }

    const { result: returnValue } = renderHook(() =>
      useSlider({
        totalItems: 5,
        itemsPerPage: 2,
        infiniteMode: false,
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
        infiniteMode: false,
      })
    )

    const finalState = {
      currentItem: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
      infinite: false,
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
        infiniteMode: false,
      })
    )

    const { sliderDispatch } = result.current

    act(() => {
      sliderDispatch({ type: 'PREVIOUS_PAGE' })
    })

    expect(result.current.sliderState).toEqual({
      currentItem: 4,
      currentPage: 2,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
      infinite: false,
    })

    act(() => {
      sliderDispatch({ type: 'PREVIOUS_PAGE' })
    })

    expect(result.current.sliderState).toEqual({
      currentItem: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
      infinite: false,
    })
  })

  it('should go to a certain page and update state accordingly', () => {
    const { result } = renderHook(() =>
      useSlider({
        totalItems: 5,
        itemsPerPage: 2,
        infiniteMode: false,
      })
    )

    const { sliderDispatch } = result.current

    act(() => {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 1,
          shouldSlide: true,
        },
      })
    })

    expect(result.current.sliderState).toEqual({
      currentItem: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
      infinite: false,
    })

    act(() => {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 2,
          shouldSlide: true,
        },
      })
    })

    expect(result.current.sliderState).toEqual({
      currentItem: 4,
      currentPage: 2,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
      infinite: false,
    })

    act(() => {
      sliderDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 0,
          shouldSlide: true,
        },
      })
    })

    expect(result.current.sliderState).toEqual({
      currentItem: 0,
      currentPage: 0,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
      infinite: false,
    })
  })
})
