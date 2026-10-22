import { FC } from 'react'
import AnimatedLogo from './AnimatedLogo'

interface Props {
  text?: string
  size?: number
  fullScreen?: boolean // true = بياخد كل الشاشة
}

const LogoLoader: FC<Props> = ({ text = 'عم يحمّل…', size = 96, fullScreen = false }) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      minHeight: fullScreen ? '100vh' : '60vh',
      width: '100%',
    }}
  >
    <AnimatedLogo size={size} loading label={text} />
    {text && <span style={{ fontSize: 14, color: '#6b7280' }}>{text}</span>}
  </div>
)

export default LogoLoader