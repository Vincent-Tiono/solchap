import React, { useEffect, useState } from 'react'
// import { PlusIcon } from 'lucide-react';
// import AddressModal from './AddressModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/lib/features/cart/cartSlice';
import { DEFAULT_CURRENCY } from '@/lib/currency';
import {
    PICKUP_LOCATIONS,
    DELIVERY_CITY_OPTIONS,
    PAYMENT_PROOF_MAX_SIZE_BYTES,
    PAYMENT_PROOF_MAX_SIZE_LABEL,
    useCheckoutDraft,
} from '@/lib/checkoutDraft';

const OrderSummary = ({ items, currencyCode, onOrderComplete }) => {

    const activeCurrency = currencyCode || DEFAULT_CURRENCY;
    const router = useRouter();
    const dispatch = useDispatch();

    const { draft, setField, setStep, isHydrated, validation, pricing, clearDraft, buildOrderPayload } = useCheckoutDraft(items, activeCurrency);
    const {
        checkoutStep,
        shippingMethod,
        contactMethod,
        customerName,
        whatsappCountryCode,
        whatsappNumber,
        lineId,
        email,
        deliveryCity,
        otherDeliveryCity,
        deliveryPostalCode,
        deliveryAddress,
        pickupLocation,
        disclaimers,
    } = draft;
    const {
        allDisclaimersAccepted,
        isWhatsappCountryCodeValid,
        isCustomerNameMissing,
        isWhatsappNumberMissing,
        isLineIdMissing,
        isEmailValid,
        isDeliveryCityMissing,
        isOtherDeliveryCityMissing,
        isDeliveryPostalCodeInvalid,
        isDeliveryAddressMissing,
        isPickupLocationMissing,
        isPaymentInfoComplete,
    } = validation;
    const {
        isIndonesiaDelivery,
        orderCurrency,
        formattedOrderTotal,
        formattedDeliveryFee,
        deliveryFeeMessage,
    } = pricing;

    const [paymentProof, setPaymentProof] = useState(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [confirmedEmail, setConfirmedEmail] = useState('');
    // const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');
    const [showDisclaimerError, setShowDisclaimerError] = useState(false);
    const [showPaymentInfoError, setShowPaymentInfoError] = useState(false);
    const [showPaymentProofError, setShowPaymentProofError] = useState(false);

    const trimmedWhatsappCountryCode = whatsappCountryCode.trim();
    const shouldShowWhatsappCountryCodeError = contactMethod === 'whatsapp' && (trimmedWhatsappCountryCode.length > 0 || showPaymentInfoError) && !isWhatsappCountryCodeValid;
    const trimmedEmail = email.trim();
    const shouldShowEmailError = (trimmedEmail.length > 0 || showPaymentInfoError) && !isEmailValid;
    const shouldShowDeliveryPostalCodeError = (showPaymentInfoError && validation.isDeliveryPostalCodeMissing) || isDeliveryPostalCodeInvalid;

    useEffect(() => {
        if (isPaymentInfoComplete) {
            setShowPaymentInfoError(false);
        }
    }, [isPaymentInfoComplete]);

    const handleCouponCode = async (event) => {
        event.preventDefault();
    }

    const handlePaymentProofChange = (event) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            setPaymentProof(null);
            return;
        }

        if (file.size > PAYMENT_PROOF_MAX_SIZE_BYTES) {
            setPaymentProof(null);
            event.target.value = '';
            toast.error(`Payment proof must be ${PAYMENT_PROOF_MAX_SIZE_LABEL} or smaller. Please upload it again.`);
            return;
        }

        setPaymentProof(file);
        setShowPaymentProofError(false);
    }

    const handleDisclaimerChange = (key, checked) => {
        const nextDisclaimers = {
            ...disclaimers,
            [key]: checked,
        };

        setField('disclaimers', nextDisclaimers);

        if (Object.values(nextDisclaimers).every(Boolean)) {
            setShowDisclaimerError(false);
        }
    }

    const handleProceedToPayment = () => {
        if (!allDisclaimersAccepted) {
            setShowDisclaimerError(true);
            return;
        }

        setShowDisclaimerError(false);
        setStep('payment');
    }

    const handleUploadPaymentProof = () => {
        if (!isPaymentInfoComplete) {
            setShowPaymentInfoError(true);
            return;
        }

        setShowPaymentInfoError(false);
        setStep('payment-proof');
    }

    const handleFinishOrder = (e) => {
        if (!paymentProof) {
            setShowPaymentProofError(true);
            return;
        }

        toast.promise(
            (async () => {
                setIsPlacingOrder(true);
                try {
                    await handlePlaceOrder(e);
                } finally {
                    setIsPlacingOrder(false);
                }
            })(),
            {
                loading: 'Finishing order...',
                success: 'Order saved.',
                error: (error) => error.message,
            }
        );
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!allDisclaimersAccepted) {
            throw new Error('Please accept all disclaimers before placing your order.');
        }

        if (!isPaymentInfoComplete) {
            throw new Error('Please complete your name, contact, valid email, valid postal code, and address before placing your order.');
        }

        if (!paymentProof) {
            throw new Error('Please upload your payment proof before placing your order.');
        }

        if (paymentProof.size > PAYMENT_PROOF_MAX_SIZE_BYTES) {
            setPaymentProof(null);
            throw new Error(`Payment proof must be ${PAYMENT_PROOF_MAX_SIZE_LABEL} or smaller. Please upload your payment proof again.`);
        }

        const orderFormData = buildOrderPayload({ paymentProof });

        const response = await fetch('/api/orders', {
            method: 'POST',
            body: orderFormData,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || 'Unable to save order.');
        }

        setConfirmedEmail(email.trim());
        clearDraft();
        setStep('confirmation');
        onOrderComplete?.();
        dispatch(clearCart());
    }

    if (!isHydrated) {
        return (
            <div className='w-full max-w-lg lg:max-w-[600px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
                <div className='flex items-center justify-center py-20'>
                    <div className='w-8 h-8 rounded-full border-2 border-gray-300 border-t-slate-600 animate-spin'></div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[600px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            {checkoutStep !== 'confirmation' && (
                <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
            )}

            {checkoutStep === 'disclaimers' ? (
                <>
                    <p className='text-slate-400 text-xs my-4'>Please confirm before continuing</p>
                    <div className='space-y-3 pb-4 text-xs leading-5 text-slate-500'>
                        <label className='flex items-start gap-2'>
                            <input
                                type="checkbox"
                                checked={disclaimers.productAccuracy}
                                onChange={(e) => handleDisclaimerChange('productAccuracy', e.target.checked)}
                                aria-invalid={showDisclaimerError && !disclaimers.productAccuracy}
                                className={`mt-1 accent-slate-700 ${showDisclaimerError && !disclaimers.productAccuracy ? 'outline outline-2 outline-red-500 outline-offset-1' : ''}`}
                            />
                            <span>I understand that the measurement and the color of Kain Makna may be not perfectly accurate as described or shown on this form.</span>
                        </label>
                        <label className='flex items-start gap-2'>
                            <input
                                type="checkbox"
                                checked={disclaimers.deliveryTiming}
                                onChange={(e) => handleDisclaimerChange('deliveryTiming', e.target.checked)}
                                aria-invalid={showDisclaimerError && !disclaimers.deliveryTiming}
                                className={`mt-1 accent-slate-700 ${showDisclaimerError && !disclaimers.deliveryTiming ? 'outline outline-2 outline-red-500 outline-offset-1' : ''}`}
                            />
                            <span>I understand that since Kain Makna is made locally in Nusa Tenggara Timur and the products are currently placed in Kupang, delivery will take some time and the receiving time will range from late May to June. Solar Chapter will make sure to inform the delivery and distribution details in a timely manner to each customer.</span>
                        </label>
                        <label className='flex items-start gap-2'>
                            <input
                                type="checkbox"
                                checked={disclaimers.limitedStock}
                                onChange={(e) => handleDisclaimerChange('limitedStock', e.target.checked)}
                                aria-invalid={showDisclaimerError && !disclaimers.limitedStock}
                                className={`mt-1 accent-slate-700 ${showDisclaimerError && !disclaimers.limitedStock ? 'outline outline-2 outline-red-500 outline-offset-1' : ''}`}
                            />
                            <span>I understand that some products might be limited or not ready in stock because of high demand from other customers. Hence, Solar Chapter may contact the customer to inform them about product availability if this situation happens. Only under this situation, the customer has the right to switch the design of Kain Makna or ask for a refund.</span>
                        </label>
                    </div>
                    {showDisclaimerError && (
                        <p className='mb-3 text-xs text-red-500'>Please check all three agreements before proceeding.</p>
                    )}
                    <button onClick={handleProceedToPayment} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Proceed to Payment</button>
                </>
            ) : checkoutStep === 'payment' ? (
                <>
                    <button onClick={() => setStep('disclaimers')} className='text-xs text-slate-400 hover:text-slate-700 mt-2'> &lt; Back to disclaimers</button>
                    <p className='text-slate-400 text-xs my-4'>Shipping Method</p>
                    <div className='space-y-4 text-slate-500'>
                        <div>
                            <label htmlFor="delivery" className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type="radio"
                                    id="delivery"
                                    name="shippingMethod"
                                    onChange={() => setField('shippingMethod', 'delivery')}
                                    checked={shippingMethod === 'delivery'}
                                    className='accent-gray-500'
                                />
                                Delivery
                            </label>
                            <p className='mt-1 pl-6 text-xs leading-5 text-slate-400'>Receive Kain Makna at your home address. Shipping fee is covered by the customer.</p>
                        </div>
                        <div>
                            <label htmlFor="self-pickup" className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type="radio"
                                    id="self-pickup"
                                    name="shippingMethod"
                                    onChange={() => setField('shippingMethod', 'self-pickup')}
                                    checked={shippingMethod === 'self-pickup'}
                                    className='accent-gray-500'
                                />
                                Self Pick-up
                            </label>
                            <p className='mt-1 pl-6 text-xs leading-5 text-slate-400'>Pick up your order from Solar Chapter representatives in Taipei, Hong Kong, Shenzhen, Busan, or Singapore.</p>
                        </div>
                    </div>

                    <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                        <p className='mb-3'>Name</p>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setField('customerName', e.target.value)}
                            placeholder='Type your name'
                            aria-invalid={showPaymentInfoError && isCustomerNameMissing}
                            className={`border p-2 w-full mb-4 outline-none rounded text-slate-600 ${showPaymentInfoError && isCustomerNameMissing ? 'border-red-400' : 'border-slate-400'}`}
                        />

                        <p className='mb-3'>Contact</p>
                        <div className='flex gap-4 text-slate-500'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="contactMethod" value="whatsapp" checked={contactMethod === 'whatsapp'} onChange={() => setField('contactMethod', 'whatsapp')} className='accent-gray-500' />
                                WhatsApp
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="contactMethod" value="line" checked={contactMethod === 'line'} onChange={() => setField('contactMethod', 'line')} className='accent-gray-500' />
                                Line ID
                            </label>
                        </div>
                        {contactMethod === 'whatsapp' ? (
                            <div className='mt-3'>
                                <div className='flex gap-2'>
                                    <input
                                        type="tel"
                                        value={whatsappCountryCode}
                                        onChange={(e) => setField('whatsappCountryCode', e.target.value)}
                                        placeholder='+62'
                                        aria-invalid={shouldShowWhatsappCountryCodeError}
                                        className={`border p-2 w-24 outline-none rounded text-slate-600 ${shouldShowWhatsappCountryCodeError ? 'border-red-400' : 'border-slate-400'}`}
                                    />
                                    <input
                                        type="tel"
                                        value={whatsappNumber}
                                        onChange={(e) => setField('whatsappNumber', e.target.value)}
                                        placeholder='WhatsApp number'
                                        aria-invalid={showPaymentInfoError && isWhatsappNumberMissing}
                                        className={`border p-2 w-full outline-none rounded text-slate-600 ${showPaymentInfoError && isWhatsappNumberMissing ? 'border-red-400' : 'border-slate-400'}`}
                                    />
                                </div>
                                {shouldShowWhatsappCountryCodeError && (
                                    <p className='mt-1 text-xs text-red-500'>Please start your WhatsApp country code with +.</p>
                                )}
                                <p className='mt-1 text-xs text-slate-400'>Use the + sign followed by your country code, for example +62.</p>
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={lineId}
                                onChange={(e) => setField('lineId', e.target.value)}
                                placeholder='Line ID'
                                aria-invalid={showPaymentInfoError && isLineIdMissing}
                                className={`border p-2 w-full mt-3 outline-none rounded text-slate-600 ${showPaymentInfoError && isLineIdMissing ? 'border-red-400' : 'border-slate-400'}`}
                            />
                        )}

                        <p className='mt-4'>Email</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setField('email', e.target.value)}
                            placeholder='Type your email'
                            aria-invalid={shouldShowEmailError}
                            className={`border p-2 w-full mt-3 outline-none rounded text-slate-600 ${shouldShowEmailError ? 'border-red-400 mb-1' : 'border-slate-400 mb-3'}`}
                        />
                        {shouldShowEmailError && (
                            <p className='mb-3 text-xs text-red-500'>Please enter a valid email with @.</p>
                        )}

                        {shippingMethod === 'delivery' ? (
                            <>
                                <p className='mt-4'>City</p>
                                <select
                                    value={deliveryCity}
                                    onChange={(e) => setField('deliveryCity', e.target.value)}
                                    aria-invalid={showPaymentInfoError && isDeliveryCityMissing}
                                    className={`border p-2 w-full my-3 outline-none rounded text-slate-600 bg-white ${showPaymentInfoError && isDeliveryCityMissing ? 'border-red-400' : 'border-slate-400'}`}
                                >
                                    <option value="">Select city</option>
                                    {DELIVERY_CITY_OPTIONS.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                {deliveryFeeMessage && (
                                    <p className='-mt-1 mb-3 text-xs leading-5 text-slate-400'>{deliveryFeeMessage}</p>
                                )}
                                {deliveryCity === 'Others' && (
                                    <>
                                        <input
                                            type="text"
                                            value={otherDeliveryCity}
                                            onChange={(e) => setField('otherDeliveryCity', e.target.value)}
                                            placeholder='Type your city'
                                            aria-invalid={showPaymentInfoError && isOtherDeliveryCityMissing}
                                            className={`border p-2 w-full mb-3 outline-none rounded text-slate-600 ${showPaymentInfoError && isOtherDeliveryCityMissing ? 'border-red-400' : 'border-slate-400'}`}
                                        />
                                        <p className='-mt-1 mb-3 text-xs leading-5 text-slate-400'>Other shipments incur a delivery fee. Our team will contact you to confirm the fee and arrange delivery.</p>
                                    </>
                                )}
                                <p className='mt-4'>Address</p>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={deliveryPostalCode}
                                    onChange={(e) => setField('deliveryPostalCode', e.target.value)}
                                    aria-label="Postal code"
                                    aria-invalid={shouldShowDeliveryPostalCodeError}
                                    placeholder='Postal code'
                                    className={`border p-2 w-full mt-3 outline-none rounded text-slate-600 ${shouldShowDeliveryPostalCodeError ? 'border-red-400 mb-1' : 'border-slate-400 mb-2'}`}
                                />
                                {isDeliveryPostalCodeInvalid && (
                                    <p className='mb-2 text-xs text-red-500'>Please enter a valid postal code with numbers only.</p>
                                )}
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setField('deliveryAddress', e.target.value)}
                                    aria-label="Full address"
                                    aria-invalid={showPaymentInfoError && isDeliveryAddressMissing}
                                    rows={4}
                                    placeholder='Please write the full address to ensure a smooth delivery process'
                                    className={`border p-2 w-full my-3 outline-none rounded resize-none text-slate-600 ${showPaymentInfoError && isDeliveryAddressMissing ? 'border-red-400' : 'border-slate-400'}`}
                                />
                            </>
                        ) : (
                            <>
                                <p className='mt-4'>City</p>
                                <div className='mt-3 grid gap-2 text-slate-500 sm:grid-cols-2'>
                                    {PICKUP_LOCATIONS.map((location) => (
                                        <label key={location} htmlFor={`pickup-${location}`} className='flex items-center gap-2 cursor-pointer'>
                                            <input
                                                type="radio"
                                                id={`pickup-${location}`}
                                                name="pickupLocation"
                                                value={location}
                                                checked={pickupLocation === location}
                                                onChange={(e) => setField('pickupLocation', e.target.value)}
                                                aria-invalid={showPaymentInfoError && isPickupLocationMissing}
                                                className={`accent-gray-500 ${showPaymentInfoError && isPickupLocationMissing ? 'outline outline-2 outline-red-500 outline-offset-1' : ''}`}
                                            />
                                            {location}
                                        </label>
                                    ))}
                                </div>
                                <p className='mt-3 text-xs leading-5 text-slate-400'>Our team will contact you to arrange pick-up.</p>
                            </>
                        )}
                        {/*
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >
                                Add Address <PlusIcon size={18} />
                            </button>
                        */}
                    </div>

                    {/*
                    <div className='pb-4 border-b border-slate-200'>
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-1 text-slate-400'>
                                <p>Subtotal:</p>
                                <p>Shipping:</p>
                                {coupon && <p>Coupon:</p>}
                            </div>
                            <div className='flex flex-col gap-1 font-medium text-right'>
                                <p>{formatPrice(totalPrice, activeCurrency)}</p>
                                <p>Free</p>
                                {coupon && <p>{`-${formatPrice(coupon.discount / 100 * totalPrice, activeCurrency)}`}</p>}
                            </div>
                        </div>
                        {
                            !coupon ? (
                                <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-3'>
                                    <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                                    <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                                </form>
                            ) : (
                                <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                                    <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                                    <p>{coupon.description}</p>
                                    <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                                </div>
                            )
                        }
                    </div>
                    */}

                    <div className='space-y-2 py-4'>
                        {isIndonesiaDelivery && (
                            <div className='flex justify-between'>
                                <p>Delivery fee:</p>
                                <p className='font-medium text-right'>{formattedDeliveryFee}</p>
                            </div>
                        )}
                        <div className='flex justify-between'>
                            <p>Total ({orderCurrency}):</p>
                            <p className='font-medium text-right'>{formattedOrderTotal}</p>
                        </div>
                    </div>
                    {showPaymentInfoError && (
                        <p className='mb-3 text-xs text-red-500'>Please complete all required fields before proceeding.</p>
                    )}
                    <button onClick={handleUploadPaymentProof} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Upload Payment Proof</button>

                    {/* {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />} */}
                </>
            ) : checkoutStep === 'confirmation' ? (
                <div className='space-y-5 pt-4 text-center text-slate-500 sm:text-left'>
                    <p className='text-base leading-7'>
                        <span className='font-semibold text-slate-700'>Important:</span><br />
                        An order confirmation email has been sent to your inbox: <span className='font-medium text-slate-700'>{confirmedEmail}</span>. If you do not receive it, please <span className='font-semibold text-red-600'>check your spam folder</span> or contact us at <span className='font-medium text-slate-700'>solchap.makna@gmail.com</span>.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'
                    >
                        Back to Home
                    </button>
                </div>
            ) : (
                <>
                    <button onClick={() => setStep('payment')} className='text-xs text-slate-400 hover:text-slate-700 mt-2'> &lt; Back to contact</button>
                    <div className='my-4 py-4 border-y border-slate-200'>
                        <div className='mb-5 space-y-4 text-slate-500'>
                            <p className='font-medium text-slate-600'>We accept 3 ways of payment:</p>
                            <div>
                                <p className='font-medium text-slate-600'>1. In IDR</p>
                                <p>Account No: 6815132096 (BCA)</p>
                                <p>Name: Shafira Asya Monica</p>
                            </div>
                            <div>
                                <p className='font-medium text-slate-600'>2. In HKD</p>
                                <p>Account No: 197 671738 833 (HSBC) / +85294293967 (FPS)</p>
                                <p>Name: Shafira Asya Monica</p>
                            </div>
                            <div>
                                <p className='font-medium text-slate-600'>3. In NTD</p>
                                <p>Account No: 中華郵政 （700）00012360675435</p>
                                <p>Name: ANNYADHITA UDAYA</p>
                            </div>
                            <p className='font-medium text-slate-600'>Please write a note: “Kain Makna APAC - <em>Name</em>” when transfering</p>
                            {/* <p className='font-medium text-slate-600'>We will contact you later for the shipment fee.</p> */}
                        </div>
                        <hr className='border-slate-200 mb-5' />
                        <p className='text-slate-400 mb-3'>Payment Proof</p>
                        <label className={`flex flex-col items-center justify-center border border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-100/60 transition ${showPaymentProofError && !paymentProof ? 'border-red-400' : 'border-slate-400'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePaymentProofChange}
                                aria-invalid={showPaymentProofError && !paymentProof}
                                className='hidden'
                            />
                            <span className='text-slate-600 font-medium'>{paymentProof ? paymentProof.name : 'Upload image'}</span>
                            <span className='text-xs text-slate-400 mt-1'>Accepted formats: JPG, PNG, WEBP. Max size: {PAYMENT_PROOF_MAX_SIZE_LABEL}</span>
                        </label>
                        {showPaymentProofError && !paymentProof && (
                            <p className='mt-3 text-xs text-red-500'>Please upload payment proof before proceeding.</p>
                        )}
                    </div>
                    <div className='space-y-2 pb-4'>
                        {isIndonesiaDelivery && (
                            <div className='flex justify-between'>
                                <p>Delivery fee:</p>
                                <p className='font-medium text-right'>{formattedDeliveryFee}</p>
                            </div>
                        )}
                        <div className='flex justify-between'>
                            <p>Total ({orderCurrency}):</p>
                            <p className='font-medium text-right'>{formattedOrderTotal}</p>
                        </div>
                    </div>
                    <button
                        disabled={isPlacingOrder}
                        onClick={handleFinishOrder}
                        className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300 disabled:active:scale-100'
                    >
                        {isPlacingOrder ? 'Finishing...' : 'Finish'}
                    </button>
                </>
            )}
        </div>
    )
}

export default OrderSummary
