import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { Plus, Minus, Trash } from '@components/icons'
import { useUIStore } from '@store/ui/ui.store'
import { formatPrice } from '@lib/price'
import type { LineItem } from '@lib/api'
import s from './CartItem.module.css'

interface Props {
  item: LineItem
  currencyCode: string
  disabled?: boolean
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
  onSaveForLater?: () => void
}

const CartItem: FC<Props> = ({
  item,
  currencyCode,
  disabled,
  onIncrement,
  onDecrement,
  onRemove,
  onSaveForLater,
}) => {
  const { closeSidebarIfPresent } = useUIStore()
  const price = formatPrice(item.variant.price * item.quantity, currencyCode)
  const options = item.options?.map((o) => o.value).join(' / ')

  return (
    <li className={s.root}>
      <Link href={`/product/${item.path}`} onClick={closeSidebarIfPresent} className={s.image}>
        {item.variant.image?.url && (
          <Image
            src={item.variant.image.url}
            alt={item.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        )}
      </Link>

      <div className={s.info}>
        <div className={s.top}>
          <div className="min-w-0">
            <Link href={`/product/${item.path}`} onClick={closeSidebarIfPresent} className={s.name}>
              {item.name}
            </Link>
            {options && <p className={s.options}>{options}</p>}
          </div>
          <span className={s.price}>{price}</span>
        </div>

        <div className={s.actions}>
          {onSaveForLater && (
            <button type="button" className={s.pill} onClick={onSaveForLater} disabled={disabled}>
              Save for later
            </button>
          )}

          <div className={s.quantity}>
            <button
              type="button"
              aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
              onClick={item.quantity === 1 ? onRemove : onDecrement}
              disabled={disabled}
            >
              {item.quantity === 1 ? <Trash width={18} height={18} /> : <Minus width={18} height={18} />}
            </button>
            <span className={s.qty}>{item.quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={onIncrement} disabled={disabled}>
              <Plus width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CartItem