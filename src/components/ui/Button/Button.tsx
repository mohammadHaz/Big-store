"use client"

import cn from "clsx"
import { forwardRef, ButtonHTMLAttributes, ElementType, CSSProperties } from "react"
import s from "./Button.module.css"
import { LoadingDots } from "@/components/ui"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  className?: string
  variant?: "flat" | "slim" | "ghost" | "naked"
  active?: boolean
  Component?: ElementType
  width?: string | number
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
({ className, variant="flat", children, active, width, loading=false, disabled=false, style, Component="button", ...rest }, ref) => {

const rootClassName = cn(
s.root,
{
[s.ghost]: variant==="ghost",
[s.slim]: variant==="slim",
[s.naked]: variant==="naked",
[s.loading]: loading,
[s.disabled]: disabled
},
className
)

return (
<Component
aria-pressed={active}
data-variant={variant}
ref={ref}
className={rootClassName}
disabled={disabled}
style={{ width, ...style as CSSProperties }}
{...rest}
>
{children}
{loading && <i className="pl-2 m-0 flex"><LoadingDots /></i>}
</Component>
)
})

Button.displayName="Button"

export default Button