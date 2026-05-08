import { createSlice } from '@reduxjs/toolkit'

const normalizeCartItems = (cartItems) => {
    if (!cartItems || typeof cartItems !== 'object' || Array.isArray(cartItems)) {
        return {};
    }

    return Object.entries(cartItems).reduce((items, [productId, quantity]) => {
        const parsedQuantity = Number(quantity);

        if (productId && Number.isFinite(parsedQuantity) && parsedQuantity > 0) {
            items[productId] = Math.floor(parsedQuantity);
        }

        return items;
    }, {});
}

const getCartTotal = (cartItems) => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
        hasHydrated: false,
    },
    reducers: {
        hydrateCart: (state, action) => {
            const cartItems = normalizeCartItems(action.payload?.cartItems || action.payload);

            state.cartItems = cartItems;
            state.total = getCartTotal(cartItems);
            state.hasHydrated = true;
        },
        addToCart: (state, action) => {
            const { productId, maxStock } = action.payload
            const currentQuantity = state.cartItems[productId] || 0

            if (typeof maxStock === 'number' && currentQuantity >= maxStock) {
                return
            }

            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
            state.total -= 1
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart, hydrateCart } = cartSlice.actions

export default cartSlice.reducer
