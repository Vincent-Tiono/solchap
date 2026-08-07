'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { formatPrice, getDisplayPrice } from '@/lib/currency'

const ProductCard = ({ product }) => {

    const selectedCurrency = useSelector(state => state.currency.selected)
    const isOutOfStock = product.inventorySynced === true && product.stock === 0;
    const { price, originalPrice, isEarlyBird } = getDisplayPrice(product, selectedCurrency)

    return (
        <Link href={`/product/${product.id}`} className='group block w-full min-w-0 sm:w-60 max-xl:mx-auto'>
            <div className='relative bg-[#f1ece4] w-full h-40 sm:h-50 rounded-lg flex items-center justify-center overflow-hidden'>
                {isOutOfStock && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-[#123f19] px-3 py-1 text-xs font-medium text-[#f4efe8]">
                        Out of stock
                    </span>
                )}
                <Image
                    width={500}
                    height={354}
                    sizes="(max-width: 639px) calc(50vw - 36px), 240px"
                    className={`relative z-0 w-full h-auto max-h-full object-contain group-hover:scale-115 transition duration-300 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                    src={product.images[0]}
                    alt=""
                />
                {isOutOfStock && (
                    <div className="pointer-events-none absolute inset-0 z-[5] bg-[#f1ece4]/60" />
                )}
            </div>
            <div className='flex justify-between gap-3 text-sm text-[#3a352c] pt-2 w-full sm:max-w-60 min-w-0'>
                <div className='min-w-0 flex-1'>
                    <p className='leading-snug'>{product.name}</p>
                </div>
                <div className='shrink-0 flex items-center gap-1.5'>
                    {isEarlyBird && (
                        <p className='text-[#6b6255] line-through text-xs'>{formatPrice(originalPrice, selectedCurrency)}</p>
                    )}
                    <p className={isEarlyBird ? 'text-[#a8232f] font-medium' : ''}>{formatPrice(price, selectedCurrency)}</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
