import { useEffect, useState } from 'react';
import { DEFAULT_CURRENCY, formatPrice, getProductPrice } from '@/lib/currency';

export const PICKUP_LOCATIONS = ['Taipei', 'Hong Kong', 'Shenzhen', 'Busan', 'Singapore'];
export const DELIVERY_CITY_OPTIONS = ['Indonesia - Jabodetabek', 'Indonesia - Outside Jabodetabek', 'Others'];
const INDONESIA_DELIVERY_FEES = {
    'Indonesia - Jabodetabek': 10000,
    'Indonesia - Outside Jabodetabek': 20000,
};
export const PAYMENT_PROOF_MAX_SIZE_BYTES = 3 * 1024 * 1024;
export const PAYMENT_PROOF_MAX_SIZE_LABEL = '3 MB';
const CHECKOUT_STORAGE_KEY = 'solchap.checkout';
const CHECKOUT_STEPS = new Set(['disclaimers', 'payment', 'payment-proof']);
const SHIPPING_METHODS = new Set(['delivery', 'self-pickup']);
const CONTACT_METHODS = new Set(['whatsapp', 'line']);
const POSTAL_CODE_PATTERN = /^\d+$/;
const DEFAULT_DISCLAIMERS = {
    productAccuracy: false,
    deliveryTiming: false,
    limitedStock: false,
};
const DEFAULT_DRAFT = {
    checkoutStep: 'disclaimers',
    shippingMethod: 'delivery',
    contactMethod: 'whatsapp',
    customerName: '',
    whatsappCountryCode: '',
    whatsappNumber: '',
    lineId: '',
    email: '',
    deliveryCity: '',
    otherDeliveryCity: '',
    deliveryPostalCode: '',
    deliveryAddress: '',
    pickupLocation: '',
    disclaimers: DEFAULT_DISCLAIMERS,
};

const getStoredString = (value) => typeof value === 'string' ? value : '';

export const clearCheckoutDraft = () => {
    window.localStorage.removeItem(CHECKOUT_STORAGE_KEY);
};

const loadCheckoutDraft = () => {
    try {
        const storedDraft = window.localStorage.getItem(CHECKOUT_STORAGE_KEY);

        if (!storedDraft) {
            return DEFAULT_DRAFT;
        }

        const parsed = JSON.parse(storedDraft);

        if (!parsed || typeof parsed !== 'object') {
            return DEFAULT_DRAFT;
        }

        return {
            checkoutStep: CHECKOUT_STEPS.has(parsed.checkoutStep) ? parsed.checkoutStep : DEFAULT_DRAFT.checkoutStep,
            shippingMethod: SHIPPING_METHODS.has(parsed.shippingMethod) ? parsed.shippingMethod : DEFAULT_DRAFT.shippingMethod,
            contactMethod: CONTACT_METHODS.has(parsed.contactMethod) ? parsed.contactMethod : DEFAULT_DRAFT.contactMethod,
            customerName: getStoredString(parsed.customerName),
            whatsappCountryCode: getStoredString(parsed.whatsappCountryCode),
            whatsappNumber: getStoredString(parsed.whatsappNumber),
            lineId: getStoredString(parsed.lineId),
            email: getStoredString(parsed.email),
            deliveryCity: getStoredString(parsed.deliveryCity),
            otherDeliveryCity: getStoredString(parsed.otherDeliveryCity),
            deliveryPostalCode: getStoredString(parsed.deliveryPostalCode),
            deliveryAddress: getStoredString(parsed.deliveryAddress),
            pickupLocation: getStoredString(parsed.pickupLocation),
            disclaimers: parsed.disclaimers && typeof parsed.disclaimers === 'object'
                ? {
                    productAccuracy: Boolean(parsed.disclaimers.productAccuracy),
                    deliveryTiming: Boolean(parsed.disclaimers.deliveryTiming),
                    limitedStock: Boolean(parsed.disclaimers.limitedStock),
                }
                : DEFAULT_DISCLAIMERS,
        };
    } catch (error) {
        console.error('Failed to load checkout draft from local storage:', error);
        return DEFAULT_DRAFT;
    }
};

const saveCheckoutDraft = (draft) => {
    try {
        if (draft.checkoutStep === 'confirmation') {
            clearCheckoutDraft();
            return;
        }

        window.localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(draft));
    } catch (error) {
        console.error('Failed to save checkout draft to local storage:', error);
    }
};

export const useCheckoutDraft = (items, activeCurrency) => {
    const [draft, setDraft] = useState(DEFAULT_DRAFT);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setDraft(loadCheckoutDraft());
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        saveCheckoutDraft(draft);
    }, [draft, isHydrated]);

    const setField = (key, value) => {
        setDraft((previous) => ({ ...previous, [key]: value }));
    };

    const setStep = (checkoutStep) => setField('checkoutStep', checkoutStep);

    const clearDraft = () => {
        clearCheckoutDraft();
        setDraft(DEFAULT_DRAFT);
    };

    const {
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

    const allDisclaimersAccepted = Object.values(disclaimers).every(Boolean);
    const trimmedWhatsappCountryCode = whatsappCountryCode.trim();
    const isWhatsappCountryCodeValid = trimmedWhatsappCountryCode.startsWith('+') && trimmedWhatsappCountryCode.length > 1;
    const isCustomerNameMissing = customerName.trim().length === 0;
    const isWhatsappNumberMissing = contactMethod === 'whatsapp' && whatsappNumber.trim().length === 0;
    const isLineIdMissing = contactMethod === 'line' && lineId.trim().length === 0;
    const isContactComplete = contactMethod === 'whatsapp'
        ? isWhatsappCountryCodeValid && whatsappNumber.trim().length > 0
        : lineId.trim().length > 0;
    const selectedDeliveryCity = deliveryCity === 'Others'
        ? otherDeliveryCity.trim()
        : deliveryCity.trim();
    const trimmedDeliveryPostalCode = deliveryPostalCode.trim();
    const trimmedEmail = email.trim();
    const isEmailValid = /^[^\s@]+@[^\s@]+$/.test(trimmedEmail);
    const isDeliveryCityMissing = shippingMethod === 'delivery' && deliveryCity.trim().length === 0;
    const isOtherDeliveryCityMissing = shippingMethod === 'delivery' && deliveryCity === 'Others' && otherDeliveryCity.trim().length === 0;
    const isDeliveryPostalCodeMissing = shippingMethod === 'delivery' && trimmedDeliveryPostalCode.length === 0;
    const isDeliveryPostalCodeInvalid = shippingMethod === 'delivery' && deliveryPostalCode.length > 0 && !POSTAL_CODE_PATTERN.test(deliveryPostalCode);
    const isDeliveryAddressMissing = shippingMethod === 'delivery' && deliveryAddress.trim().length === 0;
    const isPickupLocationMissing = shippingMethod === 'self-pickup' && pickupLocation.trim().length === 0;
    const isShippingInfoComplete = shippingMethod === 'delivery'
        ? selectedDeliveryCity.length > 0 && trimmedDeliveryPostalCode.length > 0 && !isDeliveryPostalCodeInvalid && deliveryAddress.trim().length > 0
        : pickupLocation.trim().length > 0;
    const isPaymentInfoComplete = customerName.trim().length > 0 && isContactComplete && isEmailValid && isShippingInfoComplete;

    const deliveryFee = shippingMethod === 'delivery' ? INDONESIA_DELIVERY_FEES[deliveryCity] || 0 : 0;
    const isIndonesiaDelivery = deliveryFee > 0;
    const orderCurrency = isIndonesiaDelivery ? DEFAULT_CURRENCY : activeCurrency;
    const orderSubtotal = isIndonesiaDelivery
        ? items.reduce((total, item) => total + getProductPrice(item, DEFAULT_CURRENCY) * item.quantity, 0)
        : items.reduce((total, item) => total + item.selectedPrice * item.quantity, 0);
    const orderTotal = orderSubtotal + deliveryFee;
    const formattedOrderTotal = formatPrice(orderTotal, orderCurrency);
    const formattedDeliveryFee = formatPrice(deliveryFee, DEFAULT_CURRENCY);
    const deliveryFeeMessage = deliveryFee > 0
        ? `Shipment to ${deliveryCity} will incur a ${deliveryFee.toLocaleString('en-US')} IDR delivery fee.`
        : '';

    const buildOrderPayload = ({ paymentProof }) => {
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

        return orderFormData;
    };

    return {
        draft,
        setField,
        setStep,
        isHydrated,
        validation: {
            allDisclaimersAccepted,
            isWhatsappCountryCodeValid,
            isCustomerNameMissing,
            isWhatsappNumberMissing,
            isLineIdMissing,
            isContactComplete,
            isEmailValid,
            isDeliveryCityMissing,
            isOtherDeliveryCityMissing,
            isDeliveryPostalCodeMissing,
            isDeliveryPostalCodeInvalid,
            isDeliveryAddressMissing,
            isPickupLocationMissing,
            isShippingInfoComplete,
            isPaymentInfoComplete,
        },
        pricing: {
            deliveryFee,
            isIndonesiaDelivery,
            orderCurrency,
            orderSubtotal,
            orderTotal,
            formattedOrderTotal,
            formattedDeliveryFee,
            deliveryFeeMessage,
        },
        clearDraft,
        buildOrderPayload,
    };
};
