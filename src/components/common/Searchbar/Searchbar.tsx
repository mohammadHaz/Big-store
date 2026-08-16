"use client"
import { FC, memo, useEffect,useRef } from 'react'
import cn from 'clsx'
import s from './Searchbar.module.css'
import { useRouter,useSearchParams} from 'next/navigation'

interface Props {
  className?: string
  id?: string
}

const Searchbar: FC<Props> = ({ className, id = 'search' }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchParams.get('q') ?? ''
    }
  },  [searchParams])

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.key === 'Enter') {
      const q = e.currentTarget.value

      router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')

    }
  }

  return (
    <div className={cn(s.root, className)}>
      <label className="hidden" htmlFor={id}>
        Search
      </label>
      <input
        ref={inputRef}  
        id={id}
        className={s.input}
        placeholder="Search for products..."
        defaultValue={searchParams.get('q') ?? ''}
        onKeyUp={handleKeyUp}
      />
      <div className={s.iconContainer}>
        <svg className={s.icon} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          />
        </svg>
      </div>
    </div>
  )
}

export default memo(Searchbar)
