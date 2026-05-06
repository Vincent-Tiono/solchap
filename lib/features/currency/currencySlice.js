import { createSlice } from '@reduxjs/toolkit'
import { CURRENCY_CODES, DEFAULT_CURRENCY } from '@/lib/currency'

const currencySlice = createSlice({
    name: 'currency',
    initialState: {
        selected: DEFAULT_CURRENCY,
    },
    reducers: {
        setCurrency: (state, action) => {
            if (CURRENCY_CODES.includes(action.payload)) {
                state.selected = action.payload
            }
        },
    },
})

export const { setCurrency } = currencySlice.actions

export default currencySlice.reducer
