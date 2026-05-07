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
        <Link href={`/product/${product.id}`} className=' group max-xl:mx-auto'>
            <div className='relative bg-[#F5F5F5] h-40  sm:w-60 sm:h-68 rounded-lg flex items-center justify-center'>
                {isOutOfStock && (
                    <span className="absolute top-3 left-3 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white">
                        Out of stock
                    </span>
                )}
                <Image width={500} height={500} className={`max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300 ${isOutOfStock ? 'grayscale opacity-50' : ''}`} src={product.images[0]} alt="" />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                </div>
                <p>{formatPrice(price, selectedCurrency)}</p>
            </div>
        </Link>
    )
}

export default ProductCard
