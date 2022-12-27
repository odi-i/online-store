import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { Product } from 'dummyjson-api/models'

type CartItem = Pick<Product, 'id' | 'price'> & {
  count: number
}

type CartState = {
  items: CartItem[]
  count: number
  addItem(item: Omit<CartItem, 'count'>): void
  removeItem(id: number): void
}

const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        count: 0,
        addItem: (newItem) =>
          set((state) => {
            const oldItem = state.items.find((item) => newItem.id == item.id)

            if (oldItem) {
              oldItem.count += 1
            } else {
              state.items = [...state.items, { ...newItem, count: 1 }]
            }

            return { items: state.items, count: state.count + 1 }
          }),
        removeItem: (id) =>
          set((state) => {
            const item = state.items.find((item) => item.id === id)

            if (!item) {
              return state
            }

            if (item && item.count > 1) {
              item.count -= 1
              return { items: state.items, count: state.count - 1 }
            }

            const items = state.items.filter((item) => item.id !== id)
            console.log({ items })
            return { items, count: state.count - 1 }
          })
      }),
      { name: 'RSS-OnlineStore-Storage' }
    ),
    { name: 'RSS-Cart-Store' }
  )
)

export default useCartStore
