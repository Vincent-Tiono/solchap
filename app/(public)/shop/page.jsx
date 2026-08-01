'use client'
import { Suspense, useRef, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

 function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const [hideSoldOut, setHideSoldOut] = useState(false)
    const normalSectionRef = useRef(null)
    const twSectionRef = useRef(null)

    const products = useSelector(state => state.product.list)

    const isOutOfStock = (product) => product.inventorySynced === true && product.stock === 0

    const filteredProducts = (search
        ? products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : products
    ).filter(product => !hideSoldOut || !isOutOfStock(product));

    const normalProducts = filteredProducts.filter(product => !product.id.startsWith('tw_'))
    const twProducts = filteredProducts.filter(product => product.id.startsWith('tw_'))

    const scrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                {search ? (
                    <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> <MoveLeftIcon size={20} />  All <span className="text-slate-700 font-medium">Products</span></h1>
                ) : (
                    <div className="my-6 sm:my-8">
                        <p className="text-xs tracking-widest text-slate-400 uppercase">Shop — All Products</p>
                        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                            <h1 className="text-3xl sm:text-4xl text-slate-800 font-medium">Kain Makna</h1>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => scrollToSection(normalSectionRef)}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-[#123f19] hover:text-[#123f19]"
                                >
                                    Signature series
                                </button>
                                {twProducts.length > 0 && (
                                    <button
                                        onClick={() => scrollToSection(twSectionRef)}
                                        className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-[#123f19] hover:text-[#123f19]"
                                    >
                                        Taiwan Exclusive
                                    </button>
                                )}
                                <button
                                    onClick={() => setHideSoldOut(prev => !prev)}
                                    className={`rounded-md border px-4 py-2 text-sm transition ${hideSoldOut
                                        ? 'border-[#123f19] bg-[#123f19]/10 text-[#123f19]'
                                        : 'border-slate-300 text-slate-700 hover:border-[#123f19] hover:text-[#123f19]'}`}
                                >
                                    Hide sold out
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={normalSectionRef} className="flex items-end justify-between gap-4 border-b border-slate-800 pb-2 mb-6 scroll-mt-24">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="text-xl sm:text-2xl text-slate-800">Signature Series</h2>
                        <span className="text-xs tracking-widest text-slate-400 uppercase">Nos. 1–22 &amp; Blind Box</span>
                    </div>
                    <span className="text-sm text-slate-400 whitespace-nowrap">{normalProducts.length} pieces</span>
                </div>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-12">
                    {normalProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                {twProducts.length > 0 && (
                    <>
                        <div ref={twSectionRef} className="relative w-full rounded-lg bg-[#123f19] px-6 py-6 mb-12 overflow-hidden scroll-mt-24">
                            <span className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-8xl sm:text-9xl font-bold text-[#f4efe8]/10 select-none leading-none">TW</span>
                            <p className="text-xs font-semibold tracking-widest text-[#d9d1c5] uppercase">Limited Line · {twProducts.length} Pieces</p>
                            <h2 className="mt-1 text-xl sm:text-2xl text-[#f4efe8]">Kain Makna TW · Taiwan Exclusive</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                            {twProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}