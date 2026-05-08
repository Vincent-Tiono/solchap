import React, { useEffect, useState } from 'react'
// import { PlusIcon } from 'lucide-react';
// import AddressModal from './AddressModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/lib/features/cart/cartSlice';
import { DEFAULT_CURRENCY, formatPrice, getProductPrice } from '@/lib/currency';

const PICKUP_LOCATIONS = ['Taipei', 'Hong Kong', 'Shenzhen', 'Busan', 'Singapore'];
const DELIVERY_CITY_OPTIONS = ['Indonesia - Jabodetabek', 'Indonesia - Outside Jabodetabek', 'Others'];
const INDONESIA_DELIVERY_FEES = {
    'Indonesia - Jabodetabek': 10000,
    'Indonesia - Outside Jabodetabek': 20000,
};
const PAYMENT_PROOF_MAX_SIZE_BYTES = 3 * 1024 * 1024;
const PAYMENT_PROOF_MAX_SIZE_LABEL = '3 MB';
const CHECKOUT_STORAGE_KEY = 'solchap.checkout';
const CHECKOUT_STEPS = new Set(['disclaimers', 'payment', 'payment-proof']);
const SHIPPING_METHODS = new Set(['delivery', 'self-pickup']);
const CONTACT_METHODS = new Set(['whatsapp', 'line']);
const DEFAULT_DISCLAIMERS = {
    productAccuracy: false,
    deliveryTiming: false,
    limitedStock: false,
};

const getStoredString = (value) => typeof value === 'string' ? value : '';

const OrderSummary = ({ totalPrice, items, currencyCode, onOrderComplete }) => {

    const activeCurrency = currencyCode || DEFAULT_CURRENCY;
    const router = useRouter();
    const dispatch = useDispatch();

    const [checkoutStep, setCheckoutStep] = useState('disclaimers');
    const [shippingMethod, setShippingMethod] = useState('delivery');
    const [contactMethod, setContactMethod] = useState('whatsapp');
    const [customerName, setCustomerName] = useState('');
    const [whatsappCountryCode, setWhatsappCountryCode] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [lineId, setLineId] = useState('');
    const [email, setEmail] = useState('');
    const [deliveryCity, setDeliveryCity] = useState('');
    const [otherDeliveryCity, setOtherDeliveryCity] = useState('');
    const [deliveryPostalCode, setDeliveryPostalCode] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [paymentProof, setPaymentProof] = useState(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [confirmedEmail, setConfirmedEmail] = useState('');
    // const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');
    const [disclaimers, setDisclaimers] = useState(DEFAULT_DISCLAIMERS);
    const [showDisclaimerError, setShowDisclaimerError] = useState(false);
    const [showPaymentInfoError, setShowPaymentInfoError] = useState(false);
    const [showPaymentProofError, setShowPaymentProofError] = useState(false);
    const [isCheckoutDraftHydrated, setIsCheckoutDraftHydrated] = useState(false);

    const allDisclaimersAccepted = Object.values(disclaimers).every(Boolean);
    const trimmedWhatsappCountryCode = whatsappCountryCode.trim();
    const isWhatsappCountryCodeValid = trimmedWhatsappCountryCode.startsWith('+') && trimmedWhatsappCountryCode.length > 1;
    const isCustomerNameMissing = customerName.trim().length === 0;
    const isWhatsappNumberMissing = contactMethod === 'whatsapp' && whatsappNumber.trim().length === 0;
    const isLineIdMissing = contactMethod === 'line' && lineId.trim().length === 0;
    const shouldShowWhatsappCountryCodeError = contactMethod === 'whatsapp' && (trimmedWhatsappCountryCode.length > 0 || showPaymentInfoError) && !isWhatsappCountryCodeValid;
    const isContactComplete = contactMethod === 'whatsapp'
        ? isWhatsappCountryCodeValid && whatsappNumber.trim().length > 0
        : lineId.trim().length > 0;
    const selectedDeliveryCity = deliveryCity === 'Others'
        ? otherDeliveryCity.trim()
        : deliveryCity.trim();
    const trimmedDeliveryPostalCode = deliveryPostalCode.trim();
    const trimmedEmail = email.trim();
    const isEmailValid = /^[^\s@]+@[^\s@]+$/.test(trimmedEmail);
    const shouldShowEmailError = (trimmedEmail.length > 0 || showPaymentInfoError) && !isEmailValid;
    const isDeliveryCityMissing = shippingMethod === 'delivery' && deliveryCity.trim().length === 0;
    const isOtherDeliveryCityMissing = shippingMethod === 'delivery' && deliveryCity === 'Others' && otherDeliveryCity.trim().length === 0;
    const isDeliveryPostalCodeMissing = shippingMethod === 'delivery' && trimmedDeliveryPostalCode.length === 0;
    const isDeliveryAddressMissing = shippingMethod === 'delivery' && deliveryAddress.trim().length === 0;
    const isPickupLocationMissing = shippingMethod === 'self-pickup' && pickupLocation.trim().length === 0;
    const isShippingInfoComplete = shippingMethod === 'delivery'
        ? selectedDeliveryCity.length > 0 && trimmedDeliveryPostalCode.length > 0 && deliveryAddress.trim().length > 0
        : pickupLocation.trim().length > 0;
    const isPaymentInfoComplete = customerName.trim().length > 0 && isContactComplete && isEmailValid && isShippingInfoComplete;
    const deliveryFee = shippingMethod === 'delivery' ? INDONESIA_DELIVERY_FEES[deliveryCity] || 0 : 0;
    const isIndonesiaDelivery = deliveryFee > 0;
    const orderCurrency = isIndonesiaDelivery ? DEFAULT_CURRENCY : activeCurrency;
    const orderSubtotal = isIndonesiaDelivery
        ? items.reduce((total, item) => total + getProductPrice(item, DEFAULT_CURRENCY) * item.quantity, 0)
        : totalPrice;
    const orderTotalBeforeDelivery = coupon ? Number((orderSubtotal - (coupon.discount / 100 * orderSubtotal)).toFixed(2)) : orderSubtotal;
    const orderTotal = orderTotalBeforeDelivery + deliveryFee;
    const formattedOrderTotal = formatPrice(orderTotal, orderCurrency);
    const formattedDeliveryFee = formatPrice(deliveryFee, DEFAULT_CURRENCY);
    const deliveryFeeMessage = deliveryFee > 0
        ? `Shipment to ${deliveryCity} will incur a ${deliveryFee.toLocaleString('en-US')} IDR delivery fee.`
        : '';

    useEffect(() => {
        try {
            const storedDraft = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);

            if (!storedDraft) {
                return;
            }

            const draft = JSON.parse(storedDraft);

            if (!draft || typeof draft !== 'object') {
                return;
            }

            if (CHECKOUT_STEPS.has(draft.checkoutStep)) {
                setCheckoutStep(draft.checkoutStep);
            }

            if (SHIPPING_METHODS.has(draft.shippingMethod)) {
                setShippingMethod(draft.shippingMethod);
            }

            if (CONTACT_METHODS.has(draft.contactMethod)) {
                setContactMethod(draft.contactMethod);
            }

            setCustomerName(getStoredString(draft.customerName));
            setWhatsappCountryCode(getStoredString(draft.whatsappCountryCode));
            setWhatsappNumber(getStoredString(draft.whatsappNumber));
            setLineId(getStoredString(draft.lineId));
            setEmail(getStoredString(draft.email));
            setDeliveryCity(getStoredString(draft.deliveryCity));
            setOtherDeliveryCity(getStoredString(draft.otherDeliveryCity));
            setDeliveryPostalCode(getStoredString(draft.deliveryPostalCode));
            setDeliveryAddress(getStoredString(draft.deliveryAddress));
            setPickupLocation(getStoredString(draft.pickupLocation));

            if (draft.disclaimers && typeof draft.disclaimers === 'object') {
                setDisclaimers({
                    productAccuracy: Boolean(draft.disclaimers.productAccuracy),
                    deliveryTiming: Boolean(draft.disclaimers.deliveryTiming),
                    limitedStock: Boolean(draft.disclaimers.limitedStock),
                });
            }
        } catch (error) {
            console.error('Failed to load checkout draft from local storage:', error);
        } finally {
            setIsCheckoutDraftHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!isCheckoutDraftHydrated) {
            return;
        }

        try {
            if (checkoutStep === 'confirmation') {
                window.localStorage.removeItem(CHECKOUT_STORAGE_KEY);
                return;
            }

            window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify({
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
            }));
        } catch (error) {
            console.error('Failed to save checkout draft to local storage:', error);
        }
    }, [
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
        isCheckoutDraftHydrated,
    ]);

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

        setDisclaimers(nextDisclaimers);

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
        setCheckoutStep('payment');
    }

    const handleUploadPaymentProof = () => {
        if (!isPaymentInfoComplete) {
            setShowPaymentInfoError(true);
            return;
        }

        setShowPaymentInfoError(false);
        setCheckoutStep('payment-proof');
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
            throw new Error('Please complete your name, contact, valid email, postal code, and address before placing your order.');
        }

        if (!paymentProof) {
            throw new Error('Please upload your payment proof before placing your order.');
        }

        if (paymentProof.size > PAYMENT_PROOF_MAX_SIZE_BYTES) {
            setPaymentProof(null);
            throw new Error(`Payment proof must be ${PAYMENT_PROOF_MAX_SIZE_LABEL} or smaller. Please upload your payment proof again.`);
        }

        const contact = contactMethod === 'whatsapp'
            ? `${whatsappCountryCode.trim()} ${whatsappNumber.trim()}`.trim()
            : lineId.trim();
        const shippingMethodLabel = shippingMethod === 'delivery' ? 'Delivery' : 'Self Pick-up';
        const orderAddress = shippingMethod === 'delivery' ? deliveryAddress.trim() : '';
        const orderPostalCode = shippingMethod === 'delivery' ? trimmedDeliveryPostalCode : '';

        const orderFormData = new FormData();

        orderFormData.append('order', JSON.stringify({
            items: items.map((item) => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: isIndonesiaDelivery ? getProductPrice(item, DEFAULT_CURRENCY) : item.selectedPrice,
            })),
            subtotal: orderSubtotal,
            deliveryFee,
            totalPrice: orderTotal,
            currency: orderCurrency,
            shippingMethod: shippingMethodLabel,
            deliveryArea: shippingMethod === 'delivery' ? deliveryCity : '',
            deliveryCity: shippingMethod === 'delivery' ? selectedDeliveryCity : '',
            postalCode: orderPostalCode,
            pickupCity: shippingMethod === 'self-pickup' ? pickupLocation.trim() : '',
            customerName: customerName.trim(),
            contactType: contactMethod === 'whatsapp' ? 'WhatsApp' : 'Line ID',
            contact,
            whatsappCountryCode: contactMethod === 'whatsapp' ? whatsappCountryCode.trim() : '',
            whatsappNumber: contactMethod === 'whatsapp' ? whatsappNumber.trim() : '',
            lineId: contactMethod === 'line' ? lineId.trim() : '',
            email: email.trim(),
            address: orderAddress,
        }));
        orderFormData.append('paymentProof', paymentProof);

        const response = await fetch('/api/orders', {
            method: 'POST',
            body: orderFormData,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || 'Unable to save order.');
        }

        setConfirmedEmail(email.trim());
        setCheckoutStep('confirmation');
        window.localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        onOrderComplete?.();
        dispatch(clearCart());
    }

    if (!isCheckoutDraftHydrated) {
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
                    <button onClick={() => setCheckoutStep('disclaimers')} className='text-xs text-slate-400 hover:text-slate-700 mt-2'> &lt; Back to disclaimers</button>
                    <p className='text-slate-400 text-xs my-4'>Shipping Method</p>
                    <div className='space-y-4 text-slate-500'>
                        <div>
                            <label htmlFor="delivery" className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type="radio"
                                    id="delivery"
                                    name="shippingMethod"
                                    onChange={() => setShippingMethod('delivery')}
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
                                    onChange={() => setShippingMethod('self-pickup')}
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
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder='Type your name'
                            aria-invalid={showPaymentInfoError && isCustomerNameMissing}
                            className={`border p-2 w-full mb-4 outline-none rounded text-slate-600 ${showPaymentInfoError && isCustomerNameMissing ? 'border-red-400' : 'border-slate-400'}`}
                        />

                        <p className='mb-3'>Contact</p>
                        <div className='flex gap-4 text-slate-500'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="contactMethod" value="whatsapp" checked={contactMethod === 'whatsapp'} onChange={() => setContactMethod('whatsapp')} className='accent-gray-500' />
                                WhatsApp
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="contactMethod" value="line" checked={contactMethod === 'line'} onChange={() => setContactMethod('line')} className='accent-gray-500' />
                                Line ID
                            </label>
                        </div>
                        {contactMethod === 'whatsapp' ? (
                            <div className='mt-3'>
                                <div className='flex gap-2'>
                                    <input
                                        type="tel"
                                        value={whatsappCountryCode}
                                        onChange={(e) => setWhatsappCountryCode(e.target.value)}
                                        placeholder='+62'
                                        aria-invalid={shouldShowWhatsappCountryCodeError}
                                        className={`border p-2 w-24 outline-none rounded text-slate-600 ${shouldShowWhatsappCountryCodeError ? 'border-red-400' : 'border-slate-400'}`}
                                    />
                                    <input
                                        type="tel"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
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
                                onChange={(e) => setLineId(e.target.value)}
                                placeholder='Line ID'
                                aria-invalid={showPaymentInfoError && isLineIdMissing}
                                className={`border p-2 w-full mt-3 outline-none rounded text-slate-600 ${showPaymentInfoError && isLineIdMissing ? 'border-red-400' : 'border-slate-400'}`}
                            />
                        )}

                        <p className='mt-4'>Email</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                    onChange={(e) => setDeliveryCity(e.target.value)}
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
                                            onChange={(e) => setOtherDeliveryCity(e.target.value)}
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
                                    value={deliveryPostalCode}
                                    onChange={(e) => setDeliveryPostalCode(e.target.value)}
                                    aria-label="Postal code"
                                    aria-invalid={showPaymentInfoError && isDeliveryPostalCodeMissing}
                                    placeholder='Postal code'
                                    className={`border p-2 w-full mt-3 mb-2 outline-none rounded text-slate-600 ${showPaymentInfoError && isDeliveryPostalCodeMissing ? 'border-red-400' : 'border-slate-400'}`}
                                />
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
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
                                                onChange={(e) => setPickupLocation(e.target.value)}
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
                    <button onClick={() => setCheckoutStep('payment')} className='text-xs text-slate-400 hover:text-slate-700 mt-2'> &lt; Back to contact</button>
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
