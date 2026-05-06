'use client'
import { assets } from "@/assets/assets"
import { CURRENCY_OPTIONS } from "@/lib/currency"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        prices: CURRENCY_OPTIONS.reduce((prices, currency) => ({
            ...prices,
            [currency.code]: "",
        }), {}),
    })
    const [loading, setLoading] = useState(false)


    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onPriceChangeHandler = (currencyCode, value) => {
        setProductInfo({
            ...productInfo,
            prices: {
                ...productInfo.prices,
                [currencyCode]: value,
            },
        })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Logic to add a product
        
    }


    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div htmlFor="" className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="grid w-full max-w-sm gap-4 sm:grid-cols-3">
                {CURRENCY_OPTIONS.map((currency) => (
                    <label key={currency.code} className="flex flex-col gap-2">
                        Price ({currency.code})
                        <input
                            type="number"
                            value={productInfo.prices[currency.code]}
                            onChange={(e) => onPriceChangeHandler(currency.code, e.target.value)}
                            placeholder="0"
                            className="w-full p-2 px-4 outline-none border border-slate-200 rounded resize-none"
                            required
                        />
                    </label>
                ))}
            </div>

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">Add Product</button>
        </form>
    )
}
