/** @jsx jsx */
import { Box, Flex, Label, jsx } from 'theme-ui'
import React, {
  useReducer,
  useRef,
  Fragment,
  useEffect,
  useCallback,
} from 'react'
import type { ComponentType, FC, RefObject } from 'react'

import Selector from './AccordionItemSliderSelector'
import throttle from '../utils/throttle'

/**
 * Get the event pageX attribute, with support for mobile events
 */
function getPageX(evt: any) {
  if (evt.targetTouches && evt.targetTouches.length > 0) {
    return evt.targetTouches[0].pageX
  }

  return evt.pageX
}

interface Range {
  min: number
  max: number
}

interface Props {
  // Slider range
  range: Range
  // Cursor position in "range" units
  cursor: {
    left: number
    right: number
  }
  disabled?: boolean
  displayPopup?: boolean
  onChange?: (range: Range) => void
  formatValue?: (value: number) => number | string
  handleIcon?: ComponentType | null
}

// 'left' if dragging left cursor
// 'right' if dragging right cursor
// false if not dragging
type Drag = 'left' | 'right' | false

interface State {
  min: number
  max: number
  cursorLeft: {
    formatted: number | string
    value: number
    offset: number
  }
  cursorRight: {
    formatted: number | string
    value: number
    offset: number
  }
  dragging: Drag
}

type Action =
  | {
      type: 'setLeft'
      data: {
        offset: number
        dragging?: Drag
      }
    }
  | {
      type: 'setRight'
      data: {
        offset: number
        dragging?: Drag
      }
    }
  | {
      type: 'setDrag'
      data: {
        dragging: Drag
      }
    }

const reducer = (format: (value: number) => number | string) => (
  state: State,
  action: Action
): State => {
  if (action.type === 'setLeft') {
    const {
      data: { offset, dragging = state.dragging },
    } = action

    const value = state.min + (state.max - state.min) * offset

    if (dragging === false || value > state.cursorRight.value) {
      return state
    }

    return {
      ...state,
      dragging,
      cursorLeft: {
        formatted: format(value),
        offset,
        value,
      },
    }
  }

  if (action.type === 'setRight') {
    const {
      data: { offset, dragging = state.dragging },
    } = action

    const value = state.min + (state.max - state.min) * offset

    if (dragging === false || value < state.cursorLeft.value) {
      return state
    }

    return {
      ...state,
      dragging,
      cursorRight: {
        formatted: format(value),
        offset,
        value,
      },
    }
  }

  if (action.type === 'setDrag') {
    return {
      ...state,
      dragging: action.data.dragging,
    }
  }

  return state
}

const findCursor = (
  e: React.TouchEvent | React.MouseEvent,
  sliderRef: RefObject<HTMLDivElement>,
  state: State
) => {
  const rect = sliderRef!.current!.getBoundingClientRect()
  const xPos = Math.min(Math.max(0, getPageX(e) - rect.left), rect.width)

  const leftPos = rect.width * state.cursorLeft.offset
  const rightPos = rect.width * state.cursorRight.offset

  // Which one has a absolute value closer to 0
  const position =
    Math.abs(leftPos - xPos) < Math.abs(rightPos - xPos) ? 'left' : 'right'

  return {
    position: position as 'left' | 'right',
    offset: xPos / rect.width,
  }
}

const Labels: FC<{ left: string | number; right: string | number }> = ({
  left,
  right,
}) => (
  <Flex sx={{ justifyContent: 'flex-end' }}>
    <Label
      sx={{
        color: '#727273',
        fontWeight: 'normal',
        fontSize: '.875rem',
        textTransform: 'initial',
        letterSpacing: 0,
        width: 'auto',
      }}
    >
      {left}
    </Label>
    <span
      sx={{
        marginLeft: ' .25rem',
        marginRight: '.25rem',
        color: '#727273',
        fontWeight: 'normal',
        fontSize: '.875rem',
        textTransform: 'initial',
        letterSpacing: 0,
      }}
    >
      &ndash;
    </span>
    <Label
      sx={{
        color: '#727273',
        fontWeight: 'normal',
        fontSize: '.875rem',
        textTransform: 'initial',
        letterSpacing: 0,
        width: 'auto',
      }}
    >
      {right}
    </Label>
  </Flex>
)

const useRangeSlider = ({
  range,
  cursor,
  onChange = () => {},
  formatValue = (a) => a,
  disabled,
}: Pick<
  Props,
  'range' | 'cursor' | 'onChange' | 'formatValue' | 'disabled'
>) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const cursorLeft = Math.max(range.min, cursor.left)
  const cursorRight = Math.min(range.max, cursor.right)
  const [state, dispatch] = useReducer(reducer(formatValue), {
    min: range.min,
    max: range.max,
    cursorLeft: {
      formatted: formatValue(cursorLeft),
      value: cursorLeft,
      offset: (cursorLeft - range.min) / (range.max - range.min),
    },
    cursorRight: {
      formatted: formatValue(cursorRight),
      value: cursorRight,
      offset: (cursorRight - range.min) / (range.max - range.min),
    },
    dragging: false,
  })

  const handleDown = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled === true) {
        return
      }

      const { position, offset } = findCursor(e, sliderRef, state)

      dispatch({
        type: position === 'left' ? 'setLeft' : 'setRight',
        data: {
          offset,
          dragging: position,
        },
      })
    },
    [disabled, state]
  )

  const handleMove = useCallback(
    throttle((e: React.TouchEvent | React.MouseEvent) => {
      const { offset } = findCursor(e, sliderRef, state)

      dispatch({
        type: state.dragging === 'left' ? 'setLeft' : 'setRight',
        data: {
          offset,
        },
      })
    }),
    [state]
  )

  const handleUp = useCallback(() => {
    dispatch({
      type: 'setDrag',
      data: {
        dragging: false,
      },
    })

    // Schedule to next frame so the slider transitions into its final state
    requestAnimationFrame(() => {
      onChange({
        min: state.cursorLeft.value,
        max: state.cursorRight.value,
      })
    })
  }, [onChange, state.cursorLeft.value, state.cursorRight.value])

  // Use global event handlers so the user can use drag outside
  // the component's area
  useEffect(() => {
    if (state.dragging === false) {
      return
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('touchmove', handleMove)

    window.addEventListener('pointerup', handleUp)
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('touchmove', handleMove)

      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('touchend', handleUp)
    }
  }, [handleMove, handleUp, state.dragging])

  return {
    handleDown,
    sliderRef,
    state,
  }
}

const SearchFilterAccordionItemSlider: FC<Props> = ({
  range,
  cursor,
  onChange = () => {},
  formatValue = (a) => a,
  displayPopup = true,
  handleIcon = null,
  disabled = false,
}) => {
  const { handleDown, sliderRef, state } = useRangeSlider({
    range,
    cursor,
    onChange,
    formatValue,
    disabled,
  })

  return (
    <Fragment>
      <Box
        aria-valuenow={0}
        sx={{
          height: 24,
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'none',
          width: '100%',
          position: 'relative',
          cursor: 'pointer',
          ':focus': {
            outline: 0,
          },
        }}
        onTouchStart={handleDown}
        onPointerDown={handleDown}
        role="slider"
        tabIndex={0}
      >
        <Selector
          offset={state.cursorLeft.offset}
          value={state.cursorLeft.formatted}
          active={state.dragging === 'left'}
          displayPopup={displayPopup}
          icon={handleIcon}
        />
        <Box
          ref={sliderRef}
          sx={{
            backgroundColor: '#e3e4e6',
            borderRadius: '9999px',
            height: '0.25rem',
            overflow: 'hidden',
            position: 'absolute',
            top: '0.7rem',
            width: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: disabled ? '#e3e4e6' : 'primary',
              height: '100%',
              position: 'absolute',
              left: `${state.cursorLeft.offset * 100}%`,
              right: `${(1 - state.cursorRight.offset) * 100}%`,
            }}
          />
        </Box>
        <Selector
          offset={state.cursorRight.offset}
          value={state.cursorRight.formatted}
          active={state.dragging === 'right'}
          displayPopup={displayPopup}
          icon={handleIcon}
        />
      </Box>

      <Labels
        left={state.cursorLeft.formatted}
        right={state.cursorRight.formatted}
      />
    </Fragment>
  )
}

export default SearchFilterAccordionItemSlider
