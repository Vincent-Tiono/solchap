'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const OurProducts = () => {

    const displayQuantity = 4
    const products = useSelector(state => state.product.list)

    return (
        <div className='bg-white px-6 pb-15 pt-8 sm:pt-10'>
            <div className='max-w-6xl mx-auto'>
                <Title title='Our Products' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
                <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                    {products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, displayQuantity).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OurProducts
