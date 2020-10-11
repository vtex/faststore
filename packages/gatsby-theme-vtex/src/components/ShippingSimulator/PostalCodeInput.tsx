import React, { FC, useRef } from 'react'
import { Input } from '@vtex/store-ui'

import useMaskedInput from '../../sdk/mask/useMaskedInput'

interface Props extends React.ComponentPropsWithoutRef<typeof Input> {
  variant: string
}

const PostalCodeInput: FC<Props> = ({
  variant,
  onChange: rawOnChange,
  value,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  // @ts-ignore
  const onChange = useMaskedInput({
    input: inputRef,
    mask: ['8'],
    onChange: rawOnChange,
  })

  return <Input ref={inputRef} onChange={onChange} value={value} {...props} />
}

export default PostalCodeInput
