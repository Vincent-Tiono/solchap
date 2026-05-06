'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { DEFAULT_CURRENCY, formatPrice } from "@/lib/currency";

const OrderItem = ({ order }) => {

    const orderCurrency = order.currency || DEFAULT_CURRENCY;
    const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];
    const address = order.address || {};
    const status = String(order.status || 'pending');

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {orderItems.map((item, index) => {
                            const productName = item.product?.name || item.name || 'Product';
                            const productImage = item.product?.images?.[0]?.src || item.product?.images?.[0] || item.image || item.images?.[0]?.src || item.images?.[0];

                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                        {productImage ? (
                                            <Image
                                                className="h-14 w-auto"
                                                src={productImage}
                                                alt={productName}
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            <span className="text-xl font-medium text-slate-400">{productName.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center text-sm">
                                        <p className="font-medium text-slate-600 text-base">{productName}</p>
                                        <p>{formatPrice(item.price, orderCurrency)} Qty : {item.quantity} </p>
                                        <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{formatPrice(order.total, orderCurrency)}</td>

                <td className="text-left max-md:hidden">
                    <p>{[address.name, address.street].filter(Boolean).join(', ')}</p>
                    <p>{[address.city, address.state, address.zip, address.country].filter(Boolean).join(', ')}</p>
                    <p>{address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1 ${status === 'confirmed'
                            ? 'text-yellow-500 bg-yellow-100'
                            : status === 'delivered'
                                ? 'text-green-500 bg-green-100'
                                : 'text-slate-500 bg-slate-100'
                            }`}
                    >
                        <DotIcon size={10} className="scale-250" />
                        {status.split('_').join(' ').toLowerCase()}
                    </div>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{[address.name, address.street].filter(Boolean).join(', ')}</p>
                    <p>{[address.city, address.state, address.zip, address.country].filter(Boolean).join(', ')}</p>
                    <p>{address.phone}</p>
                    <br />
                    <div className="flex items-center">
                        <span className='text-center mx-auto px-6 py-1.5 rounded bg-green-100 text-green-700' >
                            {status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem
