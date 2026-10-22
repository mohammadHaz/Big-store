"use client"
import { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import cn from 'clsx'
import s from './Searchbar.module.css'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  className?: string
  id?: string
  suggestions?: string[]
}

// بدّلها بداتا حقيقية (API أو props)
const DEFAULT_SUGGESTIONS = [
  'T-Shirts',
  'Hoodies',
  'Sneakers',
  'Jackets',
  'Caps',
  'Bags',
  'Accessories',
  'New Arrivals',
]

const Searchbar: FC<Props> = ({
  className,
  id = 'search',
  suggestions = DEFAULT_SUGGESTIONS,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [active, setActive] = useState(-1)

  const close = () => {
    setOpen(false)
    setActive(-1)
  }

  // مزامنة القيمة مع الـ URL
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  // سكّر لما تكبس برّا
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q
      ? suggestions.filter((item) => item.toLowerCase().includes(q))
      : suggestions
  }, [query, suggestions])

  const submit = (value: string) => {
    const q = value.trim()
    setQuery(q)
    close()
    inputRef.current?.blur()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setOpen(true)
        setActive((i) => (i + 1) % Math.max(filtered.length, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => (i <= 0 ? filtered.length - 1 : i - 1))
        break
      case 'Enter':
        e.preventDefault()
        submit(active >= 0 && filtered[active] ? filtered[active] : query)
        break
      case 'Escape':
        close()
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div ref={rootRef} className={cn(s.root, open && s.open, className)}>
      <div className={s.panel}>
        <div className={s.inputRow}>
          <label className="hidden" htmlFor={id}>
            Search
          </label>
          <input
            ref={inputRef}
            id={id}
            className={s.input}
            placeholder="Search for products..."
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            value={query}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(-1)
              setOpen(true)
            }}
            onKeyDown={handleKeyDown}
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

        {/* الاقتراحات: نفس الخلفية، بتنزل بسلاسة */}
        <div className={s.dropdown} aria-hidden={!open}>
          <div className={s.dropdownInner}>
            <ul id={`${id}-list`} role="listbox" className={s.list}>
              {filtered.length ? (
                filtered.map((item, i) => (
                  <li
                    key={item}
                    role="option"
                    aria-selected={i === active}
                    className={cn(s.item, i === active && s.itemActive)}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()} // ما يخلي الـ input يفقد الـ focus
                    onClick={() => submit(item)}
                    tabIndex={-1}
                  >
                    <svg className={s.itemIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      />
                    </svg>
                    {item}
                  </li>
                ))
              ) : (
                <li className={s.empty}>No suggestions</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Searchbar)