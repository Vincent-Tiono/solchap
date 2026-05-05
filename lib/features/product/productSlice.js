import { createSlice } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: productDummyData,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        updateProductInventory: (state, action) => {
            const inventory = action.payload || {};

            state.list = state.list.map((product) => {
                const productInventory = inventory[product.id];

                if (!productInventory) {
                    return product;
                }

                return {
                    ...product,
                    stock: productInventory.stock,
                    inStock: productInventory.inStock,
                };
            });
        },
        clearProduct: (state) => {
            state.list = []
        }
    }
})

export const { setProduct, updateProductInventory, clearProduct } = productSlice.actions

export default productSlice.reducer
