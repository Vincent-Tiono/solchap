'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId, maxStock }) => {

    const { cartItems } = useSelector(state => state.cart);
    const quantity = cartItems[productId] || 0;
    const isMaxQuantity = typeof maxStock === 'number' && quantity >= maxStock;

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId, maxStock }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{quantity}</p>
            <button disabled={isMaxQuantity} onClick={addToCartHandler} className="p-1 select-none disabled:cursor-not-allowed disabled:text-slate-300">+</button>
        </div>
    )
}

export default Counter
