import { createSlice } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'

const getProductWithUnknownInventory = (product) => {
    const { stock, inStock, inventorySynced, ...productWithoutInventory } = product;

    return {
        ...productWithoutInventory,
        inventorySynced: false,
    };
};

const getConfirmedStock = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const stock = Number(value);

    return Number.isFinite(stock) ? stock : null;
};

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: productDummyData.map(getProductWithUnknownInventory),
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload.map(getProductWithUnknownInventory)
        },
        updateProductInventory: (state, action) => {
            const inventory = action.payload || {};

            state.list = state.list.map((product) => {
                const productInventory = inventory[product.id];

                if (!productInventory) {
                    return {
                        ...product,
                        stock: undefined,
                        inStock: undefined,
                        inventorySynced: false,
                    };
                }

                const stock = getConfirmedStock(productInventory.stock);

                if (stock === null) {
                    return {
                        ...product,
                        stock: undefined,
                        inStock: undefined,
                        inventorySynced: false,
                    };
                }

                return {
                    ...product,
                    stock,
                    inStock: stock > 0,
                    inventorySynced: true,
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
