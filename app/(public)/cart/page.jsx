'use client'
import Counter from "@/components/Counter";
import Loading from "@/components/Loading";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice, getProductPrice } from "@/lib/currency";

const CHECKOUT_STORAGE_KEY = 'solchap.checkout';

export default function Cart() {

    const { cartItems, hasHydrated } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);
    const selectedCurrency = useSelector(state => state.currency.selected);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                const itemPrice = getProductPrice(product, selectedCurrency);
                cartArray.push({
                    ...product,
                    selectedPrice: itemPrice,
                    quantity: value,
                });
                setTotalPrice(prev => prev + itemPrice * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products, selectedCurrency]);

    useEffect(() => {
        if (!hasHydrated || isCheckoutComplete || Object.keys(cartItems).length > 0) {
            return;
        }

        window.localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    }, [cartItems, hasHydrated, isCheckoutComplete]);

    if (!hasHydrated) {
        return <Loading />
    }

    return cartArray.length > 0 || isCheckoutComplete ? (
        <div className="min-h-screen mx-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                <div className={isCheckoutComplete ? 'hidden' : ''}>
                    <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />
                </div>

                <div className={`flex items-start gap-8 max-lg:flex-col ${isCheckoutComplete ? 'justify-center py-20 max-lg:items-center' : 'justify-between'}`}>

                    <div className={`${isCheckoutComplete ? 'hidden' : 'sticky'} top-24 w-full max-w-3xl self-start max-lg:static`}>
                        <table className="w-full text-slate-600 table-auto">
                            <thead>
                                <tr className="max-sm:text-sm">
                                    <th className="text-left">Product</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                    <th className="max-md:hidden">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartArray.map((item, index) => (
                                        <tr key={index} className="space-x-2">
                                            <td className="flex gap-3 my-4">
                                                <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                    <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                                </div>
                                                <div>
                                                    <p className="max-sm:text-sm">{item.name}</p>
                                                    <p>{formatPrice(item.selectedPrice, selectedCurrency)}</p>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <Counter productId={item.id} maxStock={typeof item.stock === 'number' ? item.stock : null} />
                                            </td>
                                            <td className="text-center">{formatPrice(item.selectedPrice * item.quantity, selectedCurrency)}</td>
                                            <td className="text-center max-md:hidden">
                                                <button onClick={() => handleDeleteItemFromCart(item.id)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} currencyCode={selectedCurrency} onOrderComplete={() => setIsCheckoutComplete(true)} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}
