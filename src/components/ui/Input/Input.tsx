import cn from "clsx"
import React, { InputHTMLAttributes } from "react"
import s from "./Input.module.css"

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  className?: string
  onChange?: (value: string) => void
}

const Input: React.FC<InputProps> = ({
  className,
  onChange,
  ...rest
}) => {
  const rootClassName = cn(s.root, className)

  return (
    <label>
      <input
        className={rootClassName}
        onChange={(e) => onChange?.(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...rest}
      />
    </label>
  )
}

export default Input