'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { updateProductInventory } from "@/lib/features/product/productSlice";
import { PackageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice, getProductPrice } from "@/lib/currency";
import toast from "react-hot-toast";

const STOCK_CHECK_BUFFER_MS = 1200;

const ProductDetails = ({ product }) => {

    const productId = product.id;

    const cart = useSelector(state => state.cart.cartItems);
    const selectedCurrency = useSelector(state => state.currency.selected);
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [isCheckingStock, setIsCheckingStock] = useState(false);
    const isOutOfStock = product.inStock === false;
    const stockLeft = typeof product.stock === 'number' ? product.stock : null;
    const price = getProductPrice(product, selectedCurrency);

    const addToCartHandler = () => {
        if (isOutOfStock) return;
        dispatch(addToCart({ productId, maxStock: stockLeft }))
    }

    const viewCartHandler = async () => {
        if (isCheckingStock) return;

        setIsCheckingStock(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, STOCK_CHECK_BUFFER_MS));

            const response = await fetch('/api/inventory', { cache: 'no-store' });

            if (!response.ok) {
                throw new Error('Unable to verify stock. Please try again.');
            }

            const data = await response.json();
            const latestInventory = data.inventory || {};
            const latestProductInventory = latestInventory[productId];

            dispatch(updateProductInventory(latestInventory));

            if (!latestProductInventory) {
                throw new Error('Unable to verify stock for this product. Please try again.');
            }

            const requestedQuantity = cart[productId] || 0;
            const latestStock = Number(latestProductInventory.stock || 0);

            if (requestedQuantity > latestStock) {
                toast.error(`Only ${latestStock} item${latestStock === 1 ? '' : 's'} left. Please update your quantity.`);
                router.replace(`/product/${productId}`);
                return;
            }

            router.push('/cart');
        } catch (error) {
            toast.error(error.message || 'Unable to verify stock. Please try again.');
            router.replace(`/product/${productId}`);
        } finally {
            setIsCheckingStock(false);
        }
    }

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className={`group-hover:scale-103 group-active:scale-95 transition ${isOutOfStock ? 'grayscale opacity-50' : ''}`} alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="relative flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    {isOutOfStock && (
                        <span className="absolute top-5 left-5 rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white">
                            Out of stock
                        </span>
                    )}
                    <Image src={mainImage} alt="" width={250} height={250} className={isOutOfStock ? 'grayscale opacity-50' : ''} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className="flex items-start my-6 text-2xl font-semibold text-slate-800">
                    <p> {formatPrice(price, selectedCurrency)} </p>
                </div>
                {stockLeft !== null && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <PackageIcon size={16} className="text-slate-400" />
                        <p>
                            <span className="font-medium text-slate-700">Stock left:</span> {stockLeft}
                        </p>
                    </div>
                )}
                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} maxStock={stockLeft} />
                            </div>
                        )
                    }
                    <button disabled={isOutOfStock || isCheckingStock} onClick={() => !cart[productId] ? addToCartHandler() : viewCartHandler()} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300 disabled:active:scale-100">
                        {isOutOfStock ? 'Out of Stock' : isCheckingStock ? 'Checking Stock...' : !cart[productId] ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
