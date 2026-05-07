'use client'
import logo from "@/assets/logo.png";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import CurrencySelector from "./CurrencySelector";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        setMobileMenuOpen(false)
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/">
                        <Image src={logo} alt="Solar Chapter" className="h-14 w-auto" />
                    </Link>

                    <div className="flex items-center gap-3 sm:hidden">
                        <button
                            type="button"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-nav-menu"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-400"
                        >
                            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <CurrencySelector className="px-2 py-1.5 text-xs" />
                        <Link href="/cart" className="relative flex items-center text-slate-600">
                            <ShoppingCart size={20} />
                            <button className="absolute -top-1 -right-1 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        {/* <Link href="/">About</Link> */}
                        {/* <Link href="/">Contact</Link> */}

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <CurrencySelector />

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {/*
                            <button className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                Login
                            </button>
                        */}

                    </div>

                    {/* Mobile User Button  */}
                    {/*
                        <div className="sm:hidden">
                            <button className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                Login
                            </button>
                        </div>
                    */}
                </div>

                {mobileMenuOpen && (
                    <div id="mobile-nav-menu" className="sm:hidden pb-4">
                        <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-600 shadow-sm">
                            <Link onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 hover:bg-slate-100" href="/">Home</Link>
                            <Link onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 hover:bg-slate-100" href="/shop">Shop</Link>
                            {/* <Link onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-2 hover:bg-slate-100" href="/">About</Link> */}

                            <form onSubmit={handleSearch} className="mt-2 flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                                <Search size={18} className="text-slate-600" />
                                <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar
