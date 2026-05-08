'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { formatPrice, getProductPrice } from '@/lib/currency'

const ProductCard = ({ product }) => {

    const selectedCurrency = useSelector(state => state.currency.selected)
    const isOutOfStock = product.inventorySynced === true && product.stock === 0;
    const price = getProductPrice(product, selectedCurrency)

    return (
        <Link href={`/product/${product.id}`} className='group block w-full min-w-0 sm:w-60 max-xl:mx-auto'>
            <div className='relative bg-[#F5F5F5] w-full h-40 sm:h-50 rounded-lg flex items-center justify-center overflow-hidden'>
                {isOutOfStock && (
                    <span className="absolute top-3 left-3 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white">
                        Out of stock
                    </span>
                )}
                <Image width={500} height={500} className={`w-full h-auto max-h-full object-contain group-hover:scale-115 transition duration-300 ${isOutOfStock ? 'grayscale opacity-50' : ''}`} src={product.images[0]} alt="" />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 w-full sm:max-w-60 min-w-0'>
                <div className='min-w-0 flex-1'>
                    <p className='leading-snug'>{product.name}</p>
                </div>
                <p className='shrink-0'>{formatPrice(price, selectedCurrency)}</p>
            </div>
        </Link>
    )
}

export default ProductCard
