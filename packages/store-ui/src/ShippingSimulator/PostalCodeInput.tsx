import { Input } from 'theme-ui'
import React, { useRef } from 'react'
import type { FC } from 'react'

import useMaskedInput from './hooks/useMaskedInput'

interface Props extends React.ComponentPropsWithoutRef<typeof Input> {
  variant: string
}

const PostalCodeInput: FC<Props> = ({
  variant,
  onChange: rawOnChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onChange = useMaskedInput({
    input: inputRef,
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
    guide: false,
    onChange: rawOnChange,
    value: props.value as string,
  })

  return (
    <Input {...props} ref={inputRef} onChange={onChange} variant={variant} />
  )
}

export default PostalCodeInput
