import { FC} from 'react'
import { useUserAvatar } from '@lib/hooks/useUserAvatar'

interface Props {
  className?: string
  children?: any
}

const Avatar: FC<Props> = ({}) => {
  let { userAvatar } = useUserAvatar()
  console.log("AVATAR:", userAvatar)
  return (
    <div
      style={{ backgroundImage: userAvatar }}
      className="inline-block h-8 w-8 rounded-full border-2 border-primary hover:border-secondary focus:border-secondary transition-colors ease-linear"
    >
      {/* Add an image - We're generating a gradient as placeholder  <img></img> */}
    </div>
  )
}

export default Avatar
