import {
  createTextMaskInputElement,
  TextMaskInputElement,
  CreateTextMaskConfig,
} from 'text-mask-core'
import { MutableRefObject, useCallback, useLayoutEffect, useRef } from 'react'

interface Args extends Omit<CreateTextMaskConfig, 'inputElement'> {
  value?: string
  input: MutableRefObject<HTMLInputElement | null>
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function useMaskedInput({
  guide,
  input,
  keepCharPositions,
  mask,
  onChange,
  pipe,
  placeholderChar,
  showMask,
  value = '',
}: Args) {
  const textMask = useRef<TextMaskInputElement>()

  const init = useCallback(() => {
    if (!input?.current) {
      return
    }

    textMask.current = createTextMaskInputElement({
      guide,
      inputElement: input.current,
      keepCharPositions,
      mask,
      pipe,
      placeholderChar,
      showMask,
    })

    textMask.current.update(value)
  }, [
    guide,
    input,
    keepCharPositions,
    mask,
    pipe,
    placeholderChar,
    showMask,
    value,
  ])

  useLayoutEffect(init, [
    guide,
    keepCharPositions,
    mask,
    pipe,
    placeholderChar,
    showMask,
  ])

  useLayoutEffect(() => {
    if (value === input?.current?.value) return

    init()
  }, [init, input, value])

  return (event: React.ChangeEvent<HTMLInputElement>) => {
    if (textMask.current) {
      textMask.current.update()
    }

    if (typeof onChange === 'function') {
      onChange(event)
    }
  }
}
