'use client'
import { useEffect, useRef } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { makeStore } from '../lib/store'
import { hydrateCart } from '@/lib/features/cart/cartSlice'
import InventorySync from './InventorySync'

const CART_STORAGE_KEY = 'solchap.cart'

function CartStorageSync() {
  const dispatch = useDispatch()
  const { cartItems, hasHydrated } = useSelector(state => state.cart)

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
      dispatch(hydrateCart(storedCart ? JSON.parse(storedCart) : {}))
    } catch (error) {
      console.error('Failed to load cart from local storage:', error)
      dispatch(hydrateCart({}))
    }
  }, [dispatch])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cartItems }))
    } catch (error) {
      console.error('Failed to save cart to local storage:', error)
    }
  }, [cartItems, hasHydrated])

  return null
}

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <CartStorageSync />
      <InventorySync />
      {children}
    </Provider>
  )
}
