export const DEFAULT_CURRENCY = 'IDR';

export const CURRENCY_OPTIONS = [
    { code: 'IDR', label: 'IDR', symbol: 'Rp', locale: 'id-ID', maximumFractionDigits: 0 },
    { code: 'HKD', label: 'HKD', symbol: 'HK$', locale: 'en-HK', maximumFractionDigits: 0 },
    { code: 'NTD', label: 'NTD', symbol: 'NT$', locale: 'zh-TW', maximumFractionDigits: 0 },
];

export const CURRENCY_CODES = CURRENCY_OPTIONS.map((currency) => currency.code);

export const getCurrencyConfig = (currencyCode = DEFAULT_CURRENCY) => {
    return CURRENCY_OPTIONS.find((currency) => currency.code === currencyCode) || CURRENCY_OPTIONS[0];
};

export const getProductPrice = (product, currencyCode = DEFAULT_CURRENCY) => {
    const prices = product?.prices || {};
    const price = prices[currencyCode] ?? prices[DEFAULT_CURRENCY] ?? product?.price ?? 0;

    return Number(price) || 0;
};

export const formatPrice = (amount, currencyCode = DEFAULT_CURRENCY) => {
    const currency = getCurrencyConfig(currencyCode);
    const formattedAmount = (Number(amount) || 0).toLocaleString(currency.locale, {
        maximumFractionDigits: currency.maximumFractionDigits,
    });

    return `${currency.symbol}${formattedAmount}`;
};
