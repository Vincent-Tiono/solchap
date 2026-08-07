'use client'

import { CURRENCY_OPTIONS } from '@/lib/currency'
import { setCurrency } from '@/lib/features/currency/currencySlice'
import { useDispatch, useSelector } from 'react-redux'

const CurrencySelector = ({ className = '' }) => {
    const selectedCurrency = useSelector(state => state.currency.selected)
    const dispatch = useDispatch()

    return (
        <select
            aria-label="Currency"
            value={selectedCurrency}
            onChange={(e) => dispatch(setCurrency(e.target.value))}
            className={`rounded-full border border-[#123f19]/20 bg-transparent px-3 py-2 text-sm text-[#3a352c] outline-none transition hover:border-[#123f19]/50 ${className}`}
        >
            {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency.code} value={currency.code}>
                    {currency.label}
                </option>
            ))}
        </select>
    )
}

export default CurrencySelector
