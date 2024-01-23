import classNames from 'classnames'
import React from 'react'

import { Input } from './Input'
import { Label } from './Label'

export interface TextFieldProps {
  id: string
  label: string
  disabled?: boolean
  placeholder?: string
  icon?: React.ReactNode
  errorMessage?: string
}

export const TextField = ({
  id,
  label,
  disabled,
  placeholder,
  icon,
  errorMessage,
}: TextFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className={classNames({ 'opacity-50': disabled })}>
        {label}
      </Label>
      <Input
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        icon={icon}
        error={Boolean(errorMessage)}
        aria-describedby={`${id}-error`}
      />
      {errorMessage && (
        <span
          role="alert"
          id={`${id}-error`}
          className="text-14 text-feedback-red"
        >
          {errorMessage}
        </span>
      )}
    </div>
  )
}
