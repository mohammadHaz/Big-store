import cn from "clsx"
import React from "react"
import s from "./FeatureBar.module.css"


interface FeatureBarProps {
  className?: string
  title: string
  description?: string
  hide?: boolean
  action?: React.ReactNode
}


const FeatureBar: React.FC<FeatureBarProps> = ({
  title,
  description,
  className,
  action,
  hide = false,
}) => {

  const rootClassName = cn(
    s.root,
    "transform transition-all duration-300",
    {
      "translate-y-0 opacity-100": !hide,
      "translate-y-full opacity-0": hide,
    },
    className
  )


  return (
    <div className={rootClassName}>

      <span className="block md:inline">
        {title}
      </span>

      {description && (
        <span className="block mb-6 md:inline md:mb-0 md:ml-2">
          {description}
        </span>
      )}

      {action}

    </div>
  )
}


export default FeatureBar