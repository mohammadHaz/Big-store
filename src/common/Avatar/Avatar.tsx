import { FC, ReactNode } from 'react'
import cn from 'clsx'
import { useUserAvatar } from '@lib/hooks/useUserAvatar'

interface Props {
  className?: string
  children?: ReactNode
}

const Avatar: FC<Props> = ({ className, children }) => {
  const { userAvatar } = useUserAvatar()

  return (
    <div
      style={{ backgroundImage: children ? undefined : userAvatar }}
      className={cn(
        'relative inline-block h-8 w-8 overflow-hidden rounded-full',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Avatar