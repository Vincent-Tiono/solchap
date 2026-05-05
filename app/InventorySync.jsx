'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateProductInventory } from '@/lib/features/product/productSlice'

export default function InventorySync() {
    const dispatch = useDispatch()

    useEffect(() => {
        const syncInventory = async () => {
            try {
                const response = await fetch('/api/inventory', { cache: 'no-store' })

                if (!response.ok) {
                    throw new Error(`Inventory request failed with status ${response.status}`)
                }

                const data = await response.json()
                dispatch(updateProductInventory(data.inventory))
            } catch (error) {
                console.error('Failed to sync inventory:', error)
            }
        }

        syncInventory()

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                syncInventory()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [dispatch])

    return null
}
