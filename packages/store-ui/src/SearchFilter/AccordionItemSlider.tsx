/** @jsx jsx */
import { Box, Flex, Label, jsx } from 'theme-ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentType, FC } from 'react'

import Selector from './AccordionItemSliderSelector'

type UpEventsType = 'mouseup' | 'pointerup' | 'touchend'

type MoveEventsType = {
  [key: string]: string
  mousedown: 'mousemove'
  touchstart: 'touchmove'
  pointerdown: 'pointermove'
}

const UP_EVENTS: UpEventsType[] = ['mouseup', 'pointerup', 'touchend']

const MOVE_EVENT_MAP: MoveEventsType = {
  mousedown: 'mousemove',
  touchstart: 'touchmove',
  pointerdown: 'pointermove',
}

/**
 * Round the value to the nearest step multiple
 */
function quantize(value: number, step: number) {
  const numSteps = Math.round(value / step)
  const quantizedVal = numSteps * step

  return quantizedVal
}

/**
 * Get the event pageX attribute, with support for mobile events
 */
function getPageX(evt: React.TouchEvent | React.MouseEvent) {
  if (
    evt.nativeEvent instanceof TouchEvent &&
    evt.nativeEvent.targetTouches.length > 0
  ) {
    return evt.nativeEvent.targetTouches[0].pageX
  }

  if (evt.nativeEvent instanceof MouseEvent) {
    return evt.nativeEvent.screenX
  }

  return 0
}

/**
 * Check for the esc key event
 */
function isEscKeyEvent(evt: KeyboardEvent) {
  return evt.key === 'Escape' || evt.code === 'Escape'
}

type Props = {
  min: number
  max: number
  onChange: (args: number[]) => void
  step: number
  disabled: boolean
  defaultValues: number[]
  alwaysShowCurrentValue: boolean
  formatValue: (value: number) => number
  range: boolean
  handleIcon?: ComponentType | null
}

const Slider: FC<Props> = ({
  min = 0,
  max = 10,
  step = 1,
  onChange = () => {},
  alwaysShowCurrentValue = false,
  formatValue = (a) => a,
  range = false,
  handleIcon = null,
  defaultValues,
  disabled,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)

  const [dragging, setDragging] = useState<string | false | null>(null)
  const [translate, setTranslate] = useState({ left: 0, right: 0 })
  const [values, setValues] = useState({
    left: defaultValues && defaultValues.length > 0 ? defaultValues[0] : min,
    right:
      range && defaultValues && defaultValues.length >= 2
        ? defaultValues[1]
        : max,
  })

  const [cancelDragEvent_, setCancelDragEvent] = useState<
    (() => void) | undefined
  >(undefined)

  const [valuesBeforeDrag_, setValuesBeforeDrag] = useState({
    left: defaultValues && defaultValues.length > 0 ? defaultValues[0] : min,
    right:
      range && defaultValues && defaultValues.length >= 2
        ? defaultValues[1]
        : max,
    isCurrentValue: false,
  })

  const getTranslateValueForInputValue = useCallback(
    (value: number, position: string) => {
      const rect = sliderRef!.current!.getBoundingClientRect()
      const percentageComplete = (value - min) / (max - min)

      let translatePx = percentageComplete * rect.width

      if (position === 'right') {
        translatePx = rect.width - translatePx
      }

      return translatePx
    },
    [max, min]
  )

  const updatePositionForValue = useCallback(
    (value: number, position: string) => {
      const translatePx = getTranslateValueForInputValue(value, position)

      requestAnimationFrame(() => {
        setValues({
          ...values,
          [position]: value,
        })
        setTranslate({
          ...translate,
          [position]: translatePx,
        })
      })
    },
    [getTranslateValueForInputValue, translate, values]
  )

  const updateLayout = useCallback(() => {
    updatePositionForValue(values.left, 'left')
    updatePositionForValue(values.right, 'right')
  }, [updatePositionForValue, values])

  useEffect(() => {
    setTranslate({ left: 0, right: 0 })
    setValues({ left: min, right: max })
    updateLayout()
  }, [min, max, updateLayout])

  useEffect(() => {
    window.addEventListener('resize', updateLayout)

    if (defaultValues && defaultValues.length > 0) {
      updateLayout()
    }

    return () => {
      window.removeEventListener('resize', updateLayout)

      if (cancelDragEvent_) {
        cancelDragEvent_()
        setCancelDragEvent(undefined)
      }
    }
  }, [cancelDragEvent_, defaultValues, updateLayout])

  const getValueForPercent = (percentageComplete: number, position: string) => {
    const rawValue = min + percentageComplete * (max - min)

    let value

    if (rawValue !== min && rawValue !== max) {
      value = quantize(rawValue, step)
    } else {
      value = rawValue
    }

    if (value < min) {
      value = min
    } else if (value > max) {
      value = max
    }

    if (!range) {
      return value
    }

    if (position === 'left' && value >= values.right) {
      value = values.right - step
    } else if (position === 'right' && value <= values.left) {
      value = values.left + step
    }

    return value
  }

  const handleDragEnd = () => {
    setDragging(null)

    setCancelDragEvent(undefined)

    if (range) {
      onChange([values.left, values.right])
    } else {
      onChange([values.left])
    }
  }

  const updatePositionFromEvent = (
    e: React.TouchEvent | React.MouseEvent,
    position: string
  ) => {
    const slider = sliderRef.current
    const rect = slider!.getBoundingClientRect()

    const xPos = getPageX(e) - rect.left

    const percentageComplete = xPos / rect.width

    const value = getValueForPercent(percentageComplete, position)

    updatePositionForValue(value, position)
  }

  const handleDrag = (position: string) => (
    e: React.TouchEvent | React.MouseEvent
  ) => {
    e.preventDefault()
    updatePositionFromEvent(e, position)
  }

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (!isEscKeyEvent(evt) || !dragging) {
      return
    }

    setDragging(false)
    setValues(valuesBeforeDrag_)

    if (cancelDragEvent_) {
      cancelDragEvent_()
    }

    setCancelDragEvent(undefined)
    updateLayout()
  }

  const handleDragStart = (position: string) => (
    e: React.TouchEvent | React.MouseEvent
  ) => {
    e.stopPropagation()

    if (disabled || dragging) {
      return
    }

    setDragging(position)

    setValuesBeforeDrag({ ...values, isCurrentValue: true })

    // https://reactjs.org/docs/events.html#event-pooling
    e.persist()

    const moveHandler = handleDrag(position)

    const handleUpEvent = () => {
      if (cancelDragEvent_ !== undefined) {
        cancelDragEvent_()
      }

      handleDragEnd()
    }

    // The events bellow are attached to the body because we need
    // to support the dragging event *outside* of the slider bounds

    setCancelDragEvent(() => {
      setValuesBeforeDrag((oldValues) => {
        return { ...oldValues, isCurrentValue: false }
      })
      UP_EVENTS.forEach((evtName) =>
        document.body.removeEventListener(evtName, handleUpEvent)
      )
      document.body.removeEventListener(
        MOVE_EVENT_MAP[e.type] as any,
        moveHandler
      )
      document.body.removeEventListener('keydown', handleKeyDown)
    })

    UP_EVENTS.forEach((evtName) =>
      document.body.addEventListener(evtName, handleUpEvent)
    )
    document.body.addEventListener(MOVE_EVENT_MAP[e.type] as any, moveHandler)
    document.body.addEventListener('keydown', handleKeyDown)

    updatePositionFromEvent(e, position)
  }

  const handleSliderMouseDown = (e: React.TouchEvent | React.MouseEvent) => {
    const rect = sliderRef!.current!.getBoundingClientRect()
    const xPos = getPageX(e) - rect.left

    const leftPos = translate.left
    const rightPos = rect.width - translate.right

    let nearestPoint

    // Which one has a absolute value closer to 0
    if (!range || Math.abs(leftPos - xPos) < Math.abs(rightPos - xPos)) {
      nearestPoint = 'left'
    } else {
      nearestPoint = 'right'
    }

    handleDragStart(nearestPoint)(e)
  }

  const { left, right } = translate

  const lastLeftValue = valuesBeforeDrag_.isCurrentValue
    ? valuesBeforeDrag_.left
    : values.left

  const lastRightValue = valuesBeforeDrag_.isCurrentValue
    ? valuesBeforeDrag_.right
    : values.right

  const sliderSelectionStyle = range
    ? { left, right }
    : { left: 0, width: left }

  return (
    <div>
      <Box
        aria-valuenow={0}
        style={{
          height: 24,
          // since we can't include css with the components, the
          // prefixed attributes need to be included
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        sx={{
          width: '100%',
          position: 'relative',
        }}
        onMouseDown={handleSliderMouseDown}
        onTouchStart={handleSliderMouseDown}
        role="slider"
        tabIndex={0}
      >
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
              backgroundColor: '#134cd8',
              height: '100%',
              position: 'absolute',
            }}
            style={sliderSelectionStyle}
          />
        </Box>
        <Selector
          offset={left}
          onDragStart={handleDragStart}
          position="left"
          active={dragging === 'left'}
          displayPopup={alwaysShowCurrentValue}
          value={values.left}
          formatValue={formatValue}
          icon={handleIcon}
          sx={{
            left: 0,
            position: 'absolute',
            zIndex: 1,
          }}
        />
        {range && (
          <Selector
            offset={right}
            onDragStart={handleDragStart}
            position="right"
            active={dragging === 'right'}
            displayPopup={alwaysShowCurrentValue}
            value={values.right}
            formatValue={formatValue}
            icon={handleIcon}
            sx={{
              right: 0,
              position: 'absolute',
              zIndex: 1,
            }}
          />
        )}
      </Box>

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
          {formatValue(lastLeftValue)}
        </Label>
        {range && (
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
            <span sx={{ marginLeft: ' .25rem', marginRight: '.25rem' }}>
              &ndash;
            </span>
            {formatValue(lastRightValue)}
          </Label>
        )}
      </Flex>
    </div>
  )
}

export default Slider
